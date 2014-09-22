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