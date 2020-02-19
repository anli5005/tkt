import template from '../templates/ticketmail.hbs';

const transport = require("./nodemailer");

export default async function(event, ticket) {
    const url = `https://tkt.anli.dev/ticket/${event.slug}/${event.id}/${ticket.token}`;

    const sender = event.meta.displayName || event.slug;
    const subject = `Your ticket for ${sender}`;
    const message = template({event, ticket, url});

    return await new Promise((resolve, reject) => {
        transport.sendMail({
            from: {
                name: `Tkt - ${sender}`,
                address: "noreply-tkt@anli.dev"
            },
            to: ticket.email,
            subject,
            html: message
        }, (err, info) => {
            err ? reject(err) : resolve(info);
        });
    });
};