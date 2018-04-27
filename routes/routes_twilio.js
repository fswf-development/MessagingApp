const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const dateformat = require('dateformat');
// const moment = require('moment');
const moment = require('moment-timezone');
const delay = require('delay');

require('dotenv').load();

let env = process.env;

// Require the Twilio module and create a REST client
const twilio = require('twilio')(env.TWILIO_SID, env.TWILIO_AUTH);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Routes
    // POST: Send a Message/Reminder
    router.post('/send', function(req, res) {
        twilio.messages
            .create({
                to: req.body.previewPhone,
                from: env.TWILIO_NUM,
                body: req.body.previewMessage
            })
            .then(message => console.log(message));
        req.flash('success alert-dismissible fade show', 'Your Reminder/Message was sent!');
        res.redirect('/'+returnPage);
    });

    // DELETE: Removes message from Twilio log
    router.delete('/delete/:id', function (req,res) {
      let msgSID = {_id:req.params.id};
      console.log(msgSID._id);
      client.messages(msgSid._id).delete()
        .then((message) => console.log(message))
      //     if (message.status === 'delivered') {
      //       client.messages(msgSID).delete()
      //         .then(() => console.log("Message deleted"))
      //         .catch((err) => console.error(err));
      //     } else {
      //       setTimeout(() => tryDelete(msgSID), 1000);
      //       res.send('Success');
      //       req.flash('success', 'Reminder message deleted!');
      //     }
      //   })
      //   .catch((err) => console.error(err));
    });

    // POST: Auto response from application for received text messages
    router.post('/sms', function (req, res) {
        const twiml = new MessagingResponse();
        const message = twiml.message();
        message.body('This number does not accept messages or calls. Please use the callback # in the text you received from FSWF. Thank you!');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    });

    // DOM: Show History/Log Page
    router.get('/history', function(req,res){
        let messages = [];
        let frmtdDate = moment(Date.now()).add(-2, 'week').format('YYYY-MM-DD');
        console.log(frmtdDate);
        const filterOpts = {
            To: '',
            dateSentAfter: frmtdDate
        };
        twilio.messages.each(filterOpts, function(message) {
            messages.push(message);
        });
        delay(1000) //This delay line (in milliseconds) is necessary to ensure the app waits for the Twilio response.
                    //Increase if the history page is not loading correctly.
            .then(() => {
                res.render('page_history', {
                  responses:messages,
                  title: 'Text Message History',
                  title2: 'Text Messages Sent in the Last 14 Days',
                  moment:moment
                });
            });
    });

module.exports = router;
