const core = require('@actions/core');
const path = require("path");
const fs = require('fs');
const glob = require('glob');
const util = require('util');

const files = glob.sync( path.join(process.cwd(),'**/VersionInfo.cs'), recursive=true);
console.log("setNetVersion: start");
console.log(files);

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

let version = core.getInput('version') || '0';
let rev = core.getInput('revision') || "0";
let setCopy = false;
let showTrace = false;
let av = false;

if(version==="0")  {
    console.log('version is required parameter')
    process.exit(1);
    return;
}

if(version.indexOf('-')>0) {
    version=version.split('-')[0];
}

core.setOutput('version', version);

if(version==="PACKAGE") {
    let data = fs.readFileSync(path.join(process.cwd(),'package.json'), 'utf8');
    let json = JSON.parse(data);
    version = json.version;
}
if(version==="NEXT") {
    version = fs.readFileSync(path.join(process.cwd(),'VERSION'), 'utf8');
}

if(!rev) rev='0';

if(files.length===1) {

    let assemblyVersion = version;
    while(assemblyVersion.split('.').length<4) {
        assemblyVersion+='.0';
    }
    if(showTrace) console.log(assemblyVersion);

    let fileVersion = version;
    if(fileVersion.split('.').length>3) {
        let parts = fileVersion.split('.');
        parts.pop();
        fileVersion = parts.join('.');
    }
    fileVersion+='.'+rev;

    console.log("setNetVersion: ",fileVersion);

    const run = async () => {


        let data = await readFile(files[0], 'utf8');

        if(av) { data = data.replace(/AssemblyVersion\(\"(\d{1,})\.(\d{1,})\.(\d{1,})\.(\d{1,})\"\)/gm, 'AssemblyVersion("' + assemblyVersion + '")'); }
        data = data.replace(/AssemblyFileVersion\(\"(\d{1,})\.(\d{1,})\.(\d{1,})\.(\d{1,})\"\)/gm, 'AssemblyFileVersion("' + fileVersion + '")');

        if (setCopy) {
            data = data.replace(/©\s?(\d{1,})/gm, '© ' + (new Date().getFullYear()));
        }

        if (showTrace) console.log(data);

        await writeFile(files[0], data);
        console.log('setNetVersion: writing - ', fileVersion);

    };

    run();
    process.exit(0);
} else {
    if(files.length===0) {
        console.log("setNetVersion: no VersionInfo.cs file found");
        process.exit(1);
        return;
    }
    console.log("setNetVersion: multiple VersionInfo.cs files found");
    process.exit(1);
}
