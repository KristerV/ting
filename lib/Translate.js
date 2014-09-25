// So we can use {{Translate "string"}} in any template
UI.registerHelper('Translate', function(string) {
	return Translate(string)
})

// Translate any string
Translate = function(string) {
	if (Meteor.isServer)
		lang = 'et'
	else
		lang = Session.get('language')

	// English is not translated
	if (!isset(lang) || lang == 'en')
		return string

	// Does string and translation exist?
	if (!isset(Translations[string]) || !isset(Translations[string][lang]))
		return string

	// Return translation
	return Translations[string][lang]
}