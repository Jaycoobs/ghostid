class GhostType {

	constructor(name, attributes) {
		this.name = name;
		this.attrs = attributes;
	}

	addAttributes(...attrs) {
		for (let a of attrs)
			this.attrs = this.attrs | a;
		return this;
	}

	hasAttribute(attr) { return (this.attrs & attr) > 0; }

}

function getAttributes() {
	let attrs = {};
	attrs.freezing	= 32;
	attrs.emf		= 16;
	attrs.orbs		= 8;
	attrs.box		= 4;
	attrs.writing	= 2;
	attrs.prints	= 1;
	return attrs;
}

function getGhostTypes(attrs) {
	let ghostTypes = [];

	ghostTypes.push(new GhostType("phantom")
		.addAttributes(attrs.freezing, attrs.emf, attrs.orbs));

	ghostTypes.push(new GhostType("banshee")
		.addAttributes(attrs.freezing, attrs.emf, attrs.prints));

	ghostTypes.push(new GhostType("mare")
		.addAttributes(attrs.freezing, attrs.orbs, attrs.box));

	ghostTypes.push(new GhostType("yurei")
		.addAttributes(attrs.freezing, attrs.orbs, attrs.writing));

	ghostTypes.push(new GhostType("demon")
		.addAttributes(attrs.freezing, attrs.box, attrs.writing));

	ghostTypes.push(new GhostType("wraith")
		.addAttributes(attrs.freezing, attrs.box, attrs.prints));

	ghostTypes.push(new GhostType("jinn")
		.addAttributes(attrs.emf, attrs.orbs, attrs.box));

	ghostTypes.push(new GhostType("shade")
		.addAttributes(attrs.emf, attrs.orbs, attrs.writing));
	
	ghostTypes.push(new GhostType("oni")
		.addAttributes(attrs.emf, attrs.box, attrs.writing));

	ghostTypes.push(new GhostType("revenant")
		.addAttributes(attrs.emf, attrs.writing, attrs.prints));

	ghostTypes.push(new GhostType("poltergeist")
		.addAttributes(attrs.orbs, attrs.box, attrs.prints));

	ghostTypes.push(new GhostType("spirit")
		.addAttributes(attrs.box, attrs.writing, attrs.prints));

	return ghostTypes;
}

function getPossible(types, knowledge) {
	let possible = [];
	for (let t of types)
		possible.push(t)
	for (let k of knowledge) {
		for (let i = 0; i < possible.length; i++) {
			if (possible[i].hasAttribute(k.attr) != k.has) {
				possible.splice(i, 1);
				i--;
			}
		}
	}
	return possible;
}

function countTypesWithAttribute(types, attr) {
	let c = 0;
	for (let t of types)
		if (t.hasAttribute(attr))
			c++;
	return c;
}

function createTypeTableHeader(columnText) {
	let p = document.createElement("p");
	p.innerHTML = columnText;

	let col = document.createElement("th");
	col.appendChild(p);

	return col;
}

function createTypeTableColumn(columnText) {
	let p = document.createElement("p");
	p.innerHTML = columnText;

	let col = document.createElement("td");
	col.appendChild(p);

	return col;
}

function createTypeTableRow(type, attrs, attrorder) {
	let check = "✔️";
	let x = "✖️";

	let row = document.createElement("tr");
	row.appendChild(createTypeTableColumn(type.name));
	for (let a of attrorder)
		row.appendChild(createTypeTableColumn(type.hasAttribute(attrs[a]) ? check : x));

	return row;
}

function getAttributeUtility(attr, types) {
	let y = countTypesWithAttribute(types, attr);
	return Math.abs(types.length / 2 - y);
}

function showTypes(types, attrs) {
	types.sort((a, b) => { return a.attrs - b.attrs; });
	
	attrorder = Object.keys(attrs);
	for (let i = 0; i < attrorder.length; i++) {
		if (getAttributeUtility(attrs[attrorder[i]], types) * 2 == types.length) {
			attrorder.splice(i, 1);
			i--;
		}
	}

	attrorder.sort((a, b) => { return getAttributeUtility(attrs[a], types) - getAttributeUtility(attrs[b], types)});

	let table = document.getElementById("table");
	table.innerHTML = "";

	let header = document.createElement("tr");
	header.appendChild(createTypeTableHeader("ghost type"));
	for (let a of attrorder)
		header.appendChild(createTypeTableHeader(a));
	table.appendChild(header);

	for (let t of types)
		table.appendChild(createTypeTableRow(t, attrs, attrorder));
}

function getSelectedValue(group) {
	bts = document.querySelectorAll(`input[name="${group}"]`);

	let v = null;
	for (let b of bts) {
		if (b.checked) {
			v = b.value;
			break;
		}
	}

	return v;
}

function getKnowledge(attrs) {
	let k = [];
	for (let a in attrs) {
		let v = getSelectedValue(a);
		if (v == "yes")
			k.push({"attr": attrs[a], "has": true});
		else if (v == "no")
			k.push({"attr": attrs[a], "has": false});
	}
	return k;
}

function updatePossible() {
	showTypes(getPossible(types, getKnowledge(attrs)), attrs);
}

function createInputColumn(group, value) {
	let input = document.createElement("input");
	input.type = "radio";
	input.value = value;
	input.name = group;
	input.onclick = updatePossible;
	if (value == "maybe")
		input.checked = true;

	let col = document.createElement("td");
	col.appendChild(input);

	return col;
}

function createInputRow(value, attrs) {
	let row = document.createElement("tr");
	row.appendChild(createTypeTableColumn(value));
	for (let a of attrs)
		row.appendChild(createInputColumn(a, value));
	return row;
}

function createInputs(attrs) {
	let table = document.getElementById("inputs");

	let attrorder = Object.keys(attrs);
	attrorder.sort((a, b) => { return attrs[b] - attrs[a] });

	let header = document.createElement("tr");
	header.appendChild(createTypeTableHeader(" "));
	for (let a of attrorder)
		header.appendChild(createTypeTableHeader(a));
	table.appendChild(header);

	for (v of ["yes", "maybe", "no"])
		table.appendChild(createInputRow(v, attrorder));
}

let attrs = getAttributes();
let types = getGhostTypes(attrs);
createInputs(attrs);
showTypes(types, attrs);
