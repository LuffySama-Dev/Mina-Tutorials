import { Field, SmartContract, state, State, method } from 'o1js';

export class Square extends SmartContract {
  @state(Field) num = State<Field>(); // @state = to create the reference to the state stored on-chain in zkapp

  init() {
    super.init();
    this.num.set(Field(3));
  }

  @method update(square: Field) {
    const currentState = this.num.get();
    this.num.assertEquals(currentState);
    square.assertEquals(currentState.mul(currentState));
    this.num.set(square);
  }
}

// The contract is deplyed at : 5JuH5z9ifRCp1RR2nsvqtojTaGsxGTijFZxYAgzAuyjU1AhBo3bp
