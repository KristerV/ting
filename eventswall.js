var links = ['https://flowxo.com/hooks/a/zxkbb5gz', 'https://flowxo.com/hooks/b/q5d3m4kq']

// https://spreadsheets.google.com/feeds/cells/1_dr8sK6cOCluyXvdTA7Bhyq-KHgaNpWPH5bTCikxUa0/1/public/full?alt=json

var linkData = 'https://spreadsheets.google.com/feeds/cells/1_dr8sK6cOCluyXvdTA7Bhyq-KHgaNpWPH5bTCikxUa0/1/public/full?alt=json'

httpGET(linkData, function(resp) {
	try {
		var json = JSON.parse(resp)
		renderEvents(json)
	} catch(e) {
		console.error(e)
	}
})

function httpGET(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function renderEvents(json) {
	var events = formatEvents(json.feed.entry)
	events = filterEvents(events)
	console.debug(events)
	events.forEach(function(item){

		var paper = document.createElement('DIV')
		paper.className = 'paper'

		paper = appendElement(paper, item.Title, 'H2')
		paper = appendElement(paper, item.Description, 'P')
		paper = appendElement(paper, item.StartTime, 'P', 'text-hint')
		paper = appendElement(paper, item.Location, 'P', 'text-hint')
		paper = appendElement(paper, item.Contact, 'P', 'text-hint')

		document.getElementById('eventswall').appendChild(paper)

	})
}

function appendElement(parent, text, type, className) {
	var el = document.createElement(type)
	el.className = className
	el.appendChild(document.createTextNode(text))
	parent.appendChild(el)
	return parent
}

function formatEvents(cells) {
	var columns = []
	var events = []
	var curEvent = {}
	var firstLine = true
	var colIndex = 0
	cells.forEach(function(cell){
		var text = cell.content.$t

		if (text === 'EOL') {
			firstLine = false
		} else if (firstLine) {
			columns.push(text)
		} else if (text !== 'EOL') {
			curEvent[columns[colIndex]] = text
		}

		colIndex++
		if (colIndex >= columns.length && firstLine === false) {
			if (Object.keys(curEvent).length)
				events.push(curEvent)
			curEvent = {}
			colIndex = 0
		}

	})
	return events
}

function filterEvents(events) {
	var filtered = []
	events.forEach(function(e){
		var endDate = new Date(e.EndTime)
		var plusOneDay = endDate.setDate(endDate.getDate() + 1);
		if (plusOneDay < new Date()) return // Old events
		if (e.Deleted !== "FALSE") return // Deleted events
		filtered.push(e)
	})
	return filtered
}

function toggleEventAdder() {
	var div = document.getElementById('addEvent')
	var visible = "inline-block"
	div.style.display = div.style.display !== visible ? visible : "none";
}

function toggleSubscribeBlock() {
	var div = document.getElementById('subscribe-block')
	var visible = "inline-block"
	div.style.display = div.style.display !== visible ? visible : "none";
}
