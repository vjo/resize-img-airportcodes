#!/usr/bin/env node

var util = require('util'),
    exec = require('child_process').exec,
    program = require('commander'),
    chalk = require('chalk');

program
    .version('0.0.1')
    .option('-s, --source <s>', 'path to source image')
    .option('-d, --destination <d>', 'path to destination image folder')
    .option('-n, --name <n>', 'output name for the images')
    .option('-q, --quality <q>', 'compression level in %, default: 100', 100);

program.on('--help', function(){
    console.log('  Example:');
    console.log('');
    console.log('    $ resize-optimise-images --source ~/Download/ee748fdsj329.jpg --destination ~/git/airport-codes/assets/images --name air-author.jpg --quality 85');
    console.log('');
});

program.parse(process.argv);

if(!program.source || !program.destination || !program.name) {
    console.log(chalk.red('Error: you must specify source, destination and name options.'));
    program.help();
}

var params = {
    base: '-interlace Plane -strip -quality ' + program.quality,
    source: program.source,
    card: {
        dest: util.format('%s/card/%s', program.destination, program.name),
        resize: 'x250'
    },
    small: {
        dest: util.format('%s/small/%s', program.destination, program.name),
        resize: '500x'
    },
    medium: {
        dest: util.format('%s/medium/%s', program.destination, program.name),
        resize: '900x'
    },
    large: {
        dest: util.format('%s/large/%s', program.destination, program.name),
        resize: '1500x'
    }
};

var convert = function(format){
    var cmd = 'convert ' + params.base + ' ' + params.source + ' -resize ' + params[format].resize + ' ' + params[format].dest;
    var child = exec(cmd, function(err, stdout, stderr) {
        if (err !== null) {
            util.log(chalk.red(err));
        }
    });
    var size = exec('du -hs ' + params[format].dest, function(err, stdout, stderr){
        if (err !== null) {
            util.log(chalk.red(err));
        }
        console.log(chalk.green(format + ' done: ') + stdout);
    });
};

convert('card');
convert('small');
convert('medium');
convert('large');
