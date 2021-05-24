const nodemailer = require("nodemailer");

exports.sendInvoice = async (req, res, next) => {
  try {
    const { header, invoiceDetail, customerDetail, invoiceItem, email } =
      req.body;
    // console.log(invoiceItem);
    // return res.status(200).json();
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: '"Farm Manager" <admin@farmmanager.com>',
      to: email,
      subject: "Hello",
      text: "Hello world",
      html: header + invoiceDetail + customerDetail + invoiceItem,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.status(200).json({ message: "invoice sent" });
  } catch (err) {
    console.log(err);
  }
};
