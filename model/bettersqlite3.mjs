import { default as bettersqlite3 } from 'better-sqlite3';

console.log('Using better-sqlite3 model');

const db = new bettersqlite3(`${import.meta.dirname}/../data/books.db`, { fileMustExist: true });
