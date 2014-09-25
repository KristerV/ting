Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false})

Accounts.emailTemplates.siteName = "Ting.ee"
Accounts.emailTemplates.from = "Tingi Kirjatuvi <kirjatuvi@ting.ee>"


Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Parooli muutmine"
}
Accounts.emailTemplates.resetPassword.text = function (user, url) {
   return "Järgneva lingiga saad oma parooli muuta:\n"
     + url
     + "\n\nKui sa pole parooli muutmist tellinud, võid rahulikult seda kirja ignoreerida."
     + "\n\nParimat,\nTingi Kirjatuvi"
}

Accounts.emailTemplates.verifyEmail.subject = function (user) {
    return "Kinnita oma email"
}
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
   return "Järgneva lingiga kinnita oma e-mail:\n"
     + url
     + "\n\nPärast kinnitust peab keegi olemasolev kasutaja su sisse lubama, seda selleks, et säilitada intiimne keskkond."
     + "\n\nKui sa pole kunagi ting.ee lehel käinud, siis võid ignoreerida seda kirja."
     + "\n\nParimat,\nTingi Kirjatuvi"
}