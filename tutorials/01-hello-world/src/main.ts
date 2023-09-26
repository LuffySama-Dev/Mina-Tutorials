import { Square } from './Square.js';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
} from 'o1js';

const useProof = false;
const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });

Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } =
  Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } =
  Local.testAccounts[1];

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

const zkAppInstance = new Square(zkAppAddress);
const deployTnx = await Mina.transaction(deployerAccount, () => {
  AccountUpdate.fundNewAccount(deployerAccount);
  zkAppInstance.deploy();
});

await deployTnx.sign([deployerKey, zkAppPrivateKey]).send();

const num0 = zkAppInstance.num.get();
console.log(`The initial value of the field is ${num0}`);

const txn1 = await Mina.transaction(senderAccount, () => {
  zkAppInstance.update(Field(9));
});

await txn1.prove();
await txn1.sign([senderKey]).send();

const num1 = zkAppInstance.num.get();
console.log(`The value after first transaction is ${num1}`);

try {
  const txn2 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.update(Field(10));
  });
  await txn2.prove();
  await txn2.sign([senderKey]).send();
} catch (e: any) {
  console.log(e.message);
}
const num3 = zkAppInstance.num.get();
console.log(`The value of third txn is ${num3}`);
