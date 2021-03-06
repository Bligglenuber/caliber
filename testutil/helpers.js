// Creates a local SVN repositiory using svnadmin to run tests against
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import uuid from 'uuid';

const tempRoot = path.join( os.tmpdir(), 'caliber' );


export function createTempFolder( name ) {
	let p = tempRoot;
	if ( name ) {
		p = path.join( p, name );
	}
	p = path.join( p, uuid.v4() );
	fs.ensureDirSync(p);
	return p;
}


// replacement for mocha's it() method to return a promise instead of accept a callback
export function test(name, func) {
	it(name, () => {
		const tempDir = path.join( tempRoot, uuid.v4() );
		try {
			fs.ensureDirSync( tempDir );
			let prom = func( tempDir );
			prom = prom.then(() => {
				// only delete temp folder on successfull test
				try {
					fs.removeSync(tempDir);
				} catch (err) {
					console.error(`Could not delete temp folder for test '${name}'`);
				}
			});
			return prom;
		} catch (err) {
			return Promise.reject(err);
		}
		return Promise.resolve();
	});
}
