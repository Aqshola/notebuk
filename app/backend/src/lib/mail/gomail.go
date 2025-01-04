package mail

import (
	"backend/src/lib/common"
	"os"

	"gopkg.in/gomail.v2"
)

func InitMailer() *gomail.Dialer {

	mailHost := os.Getenv("SMTP_HOST")
	mailPort := 587
	mailUser := os.Getenv("SMTP_USER")
	mailPass := os.Getenv("SMTP_PASS")

	dialer := gomail.NewDialer(
		mailHost,
		mailPort,
		mailUser,
		mailPass,
	)

	return dialer
}

func SendEmailHTML(email string, subject string, data any, templatePath string) error {

	mailer := InitMailer()

	message := gomail.NewMessage()
	message.SetHeader("From", "donlotnime27@gmail.com")
	message.SetHeader("To", email)
	message.SetHeader("Subject", subject)
	message.SetBody("text/html", common.TemplateHTMLWithData(data, templatePath))

	return mailer.DialAndSend(message)
}
