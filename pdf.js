global.window = {}

const Path = require('path');
var fs = require('fs');
var pdf = require("pdf-creator-node");

const DOC_PATH = "./output";
const BASE_NAME = "file";

let maxFiles = 5;

var args = process.argv.slice(2);

async function start(){
	await checkDirectory();

	if(args.length > 0){
		maxFiles = +args;
	}

	generatePdf(maxFiles);
}

async function checkDirectory(){
	console.log("Verificando os diretórios.");

	await deleteFolderRecursive(DOC_PATH);

	if (!fs.existsSync(DOC_PATH)){
		await fs.mkdirSync(DOC_PATH);
	}
}

async function deleteFolderRecursive(path) {
	if (fs.existsSync(path)) {
		await fs.readdirSync(path).forEach((file, index) => {
			const curPath = Path.join(path, file);
		    if (fs.lstatSync(curPath).isDirectory()) { // recurse
		    	deleteFolderRecursive(curPath);
		    } else { // delete file
		    	fs.unlinkSync(curPath);
		    }
		});
		await fs.rmdirSync(path);
	}
};

async function generatePdf(number){
	console.log("Iniciando a criação dos documentos.");

	var options = {
		format: "A3",
		orientation: "portrait",
		border: "10mm"
	};

	var html = fs.readFileSync('template.html', 'utf8');

	for (var i = 1; i <= number; i++) {

		var obj = [{ number: i }];

		let path = DOC_PATH + `/teste documento ${i}.pdf`;

		var document = {
			html: html,
			data: {
				obj: obj
			},
			path: path
		};

		await pdf.create(document, options)
		.then(res => {
			//generateBase64(path, i);
		});
		
		console.log(i + " documento criado.");
	}

	console.log(maxFiles + " arquivo criados.");
}

start();