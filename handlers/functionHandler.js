/**
 * @file Function Handler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

const fs = xrequire('fs');

// eslint-disable-next-line no-sync
let functions = fs.readdirSync('./functions/');
for (let method of functions) {
  exports[method.replace('.js', '')] = xrequire('./functions/', method);
}
