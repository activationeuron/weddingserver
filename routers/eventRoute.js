const express = require('express');
const eventModel = require('../models/Events');
const invitationsModel = require('../models/Invitations');
const Rsvp = require('../models/Rsvp');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
var hbs = require('nodemailer-express-handlebars');
router.post('/create', async (req, res) => {
  const reqbody = req.body;
  try {
    const createdEvent = await invitationsModel.create(reqbody);
    return res.status(201).send({ success: true, data: createdEvent });
  } catch (e) {
    return res.status(400).send({ success: false, error: e });
  }
});

router.get('/all', async (req, res) => {
  try {
    const createdEvent = await invitationsModel.find();
    return res.status(200).send({ success: true, data: createdEvent });
  } catch (e) {
    return res.status(400).send({ success: false, error: e });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const createdEvent = await invitationsModel.deleteOne({ _id: id });
    return res.status(200).send({ success: true, data: createdEvent });
  } catch (e) {
    return res.status(400).send({ success: false, error: e });
  }
});

router.post('/createmany', async (req, res) => {
  const reqbody = req.body;

  const createEvent = await invitationsModel.insertMany(reqbody);
});

router.post('/create/user', async (req, res) => {
  const { users, eventId } = req.body;
  console.log(users);
  const invitations = await invitationsModel.create(users);
  console.log(invitations);
  if (invitations) {
    const array = invitations.map((inv) => inv._id);
    const added = await eventModel.findByIdAndUpdate(
      { _id: eventId },
      { $addToSet: { invitations: array } }
    );
  }
  const final = await eventModel.findById({ _id: eventId });
  return res.status(201).send({ success: true, data: final });
});

router.get('/myevent/:phone', async (req, res) => {
  const { phone } = req.params;
  console.log(phone);
  console.log(phone.substring(1));
  if (!phone) {
    return res.status(200).send({ success: false, data: 'phone Not Found' });
  }
  try {
    const userEvents = await invitationsModel.findOne({
      $or: [
        {
          phone: phone,
        },
        {
          phone: phone.substring(1),
        },
      ],
    });
    console.log(userEvents);
    if (userEvents) {
      return res.status(200).send({ success: true, data: userEvents });
    } else {
      return res
        .status(404)
        .send({ success: false, message: 'Invitation Not Found' });
    }
  } catch (e) {
    return res.status(200).send({ success: true, data: [] });
  }
});

// router.get('/:id', async (req, res) => {
//   const id = req.params.id;
//   const event = await eventModel.findById({ _id: id });
//   return res.status(200).send({ success: true, data: event });
// });

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('./views/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  portL: 587,
  secure: false,
  auth: {
    user: 'afaanwedsmariam@gmail.com',
    pass: 'afaanwedsmariam123!@#',
  },
});

transporter.use('compile', hbs(handlebarOptions));
router.post('/rsvp', async (req, res) => {
  const reqbody = req.body;
  const rsvp = await Rsvp.create(reqbody);
  console.log(rsvp, 'RSVP');
  try {
    const aggri = await Rsvp.aggregate([
      {
        $lookup: {
          from: 'invitations',
          localField: 'phone',
          foreignField: 'phone',
          as: 'data',
        },
      },
    ]);

    var dates = {
      HALDI: {
        name: 'Haldi Ceremony ',
        link: 'https://calendar.google.com/event?action=TEMPLATE&tmeid=NmFjbjZtZTZmNnJxMm9wb3ZpYWEzYjlrZ3IgYWZhYW53ZWRzbWFyaWFtQG0&tmsrc=afaanwedsmariam%40gmail.com',
        date: '03rd september 2022',
        address: '2259 Camino Rey Fullerton CA 92833',
      },
      SANGEET: {
        name: 'Sangeet ceremony',
        link: 'https://calendar.google.com/event?action=TEMPLATE&tmeid=NHI0a3NuNGhwY2hxNzFlNzQ1ZmgycWwzbzkgYWZhYW53ZWRzbWFyaWFtQG0&tmsrc=afaanwedsmariam%40gmail.com',
        date: '04th september 2022',
        address: '',
      },
      WEDDING: {
        name: 'Wedding ceremony',
        link: 'https://calendar.google.com/event?action=TEMPLATE&tmeid=MHVoYmgxbnNkcjBjMzF1bWozdTkxamppM3MgYWZhYW53ZWRzbWFyaWFtQG0&tmsrc=afaanwedsmariam%40gmail.com',
        date: '08th september 2022',
        address: 'Mount Prospect IL',
      },
      RECEPTIONS: {
        name: 'Reception ',
        link: 'https://calendar.google.com/event?action=TEMPLATE&tmeid=NWU2NmVpa3Q5MG9pcDc2ZGd0Y3BiZWU3cmsgYWZhYW53ZWRzbWFyaWFtQG0&tmsrc=afaanwedsmariam%40gmail.com',
        date: '16th september 2022',
        address: 'Villa Contempo Estate',
      },
    };

    const invArr = [];
    aggri[0].data[0].events.map((event) => {
      console.log(event);
      const data = dates[event];
      invArr.push(data);
    });
    var mailOptions = {
      from: 'afaanwedsmariam@gmail.com',
      to: req.body.email,
      template: 'email',
      subject: 'Invitations from afaan and mariam',
      context: { data: invArr },
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    if (rsvp) {
      return res.status(201).send({ success: true, data: rsvp });
    }
  } catch (e) {
    return res.status(201).send({ success: false, message: 'Fail' });
  }
});

router.get('/rsvp', async (req, res) => {
  try {
    const aggri = await Rsvp.aggregate([
      {
        $lookup: {
          from: 'invitations',
          localField: 'phone',
          foreignField: 'phone',
          as: 'data',
        },
      },
    ]);
    return res.status(200).send({ success: true, data: aggri });
  } catch (e) {
    return res
      .status(400)
      .send({ success: false, data: 'Error Retriving  Data' });
  }
});

router.get('/rsvp/:phone', async (req, res) => {
  const params = req.params;
  console.log(params);
  try {
    const data = await Rsvp.findOne(params);
    console.log(data);
    return res.status(200).send({ success: true, data: data });
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .send({ success: false, data: 'Error Retriving  Data' });
  }
});

router.get('/send-message', async (req, res) => {
  // AC748a9db7770f93e819e1ade2c8c67cb9
  // 0d9c5099b8988535f0e4127893e56598
});

module.exports = router;
