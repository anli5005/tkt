import template from '../templates/ticketmail.hbs';

const transport = require("./nodemailer");
const md = require("markdown-it")();

export default async function(event, ticket) {
    const url = `https://tkt.anli.dev/ticket/${encodeURIComponent(event.slug)}/${event.id}/${ticket.token}`;

    const sender = event.meta.displayName || event.slug;
    const subject = `${(event.meta.email && event.meta.email.subjectPrefix && event.meta.email.subjectPrefix[ticket.meta.type || "default"]) || "Your"} ticket for ${sender}`;
    
    let auxiliaryContent = false;
    if (event.meta.email && event.meta.email.auxiliaryContent && event.meta.email.auxiliaryContent[ticket.meta.type || "default"]) {
        auxiliaryContent = md.render(event.meta.email.auxiliaryContent[ticket.meta.type || "default"]);
    }

    let ticketRecipient = (event.meta.email && event.meta.email.ticketRecipient && event.meta.email.ticketRecipient[ticket.meta.type || "default"]) || "your";

    let includeName = !(event.meta.email && event.meta.email.excludeName && event.meta.email.excludeName[ticket.meta.type || "default"]);

    const message = template({event, ticket, url, auxiliaryContent, ticketRecipient, includeName});

    return await new Promise((resolve, reject) => {
        transport.sendMail({
            from: {
                name: `Tkt - ${sender}`,
                address: "noreply@tkt.anli.dev"
            },
            to: ticket.email,
            subject,
            html: message
        }, (err, info) => {
            err ? reject(err) : resolve(info);
        });
    });
};
