import {
  multisigSignatureBuffer,
  validateMultisigSignature,
} from './signatures';
import {
  TEST_FIXTURES,
} from "./fixtures";

// FIXME: transactionbuilder is deprecating, but we know this. remove this after addressing.
console.warn = jest.fn();

describe('signatures', () => {

  describe('validateMultisigSignature', () => {

    it("throws an error on an invalid signature", () => {
      const fixture = TEST_FIXTURES.transactions[0];
      expect(() => { validateMultisigSignature(fixture.network, fixture.inputs, fixture.outputs, 0, ""); }).toThrow(/is too short/i);
      expect(() => { validateMultisigSignature(fixture.network, fixture.inputs, fixture.outputs, 0, "foobar"); }).toThrow(/is too short/i);
    });

    TEST_FIXTURES.transactions.forEach((fixture) => {

      describe(`validating signature for a transaction which ${fixture.description}`, () => {

        it("returns the public key corresponding to a valid input signature", () => {
          fixture.inputs.forEach((input, inputIndex) => {
            const publicKey = validateMultisigSignature(fixture.network, fixture.inputs, fixture.outputs, inputIndex, fixture.signature[inputIndex]);
            expect(publicKey).toEqual(fixture.publicKeys[inputIndex]);
          });
        });

        it("returns false for a valid signature for a different input", () => {
          const publicKey = validateMultisigSignature(fixture.network, fixture.inputs, fixture.outputs, 0, fixture.signature[1]);
          expect(publicKey).toEqual(false);
        });

      });

    });
    
  });

  describe('multisigSignatureBuffer', () => {

    it("correctly places signatures of varying lengths into a Buffer", () => {
      const signatures = [
        "3045022100c82920c7d99e0a4055a8459c53362d15f5f8ce275322be8fd2045b43a5ae7f8d0220478b3856327a4b7809a1f858159bd437e4d93ca480e35bbe21c5cd914b6d722a",
        "304402200464b13a701b9ac16eea29d1604a73d82ba5b3aed1435a8c2c3d4f940a2499ce02206be000a5cc605b284ab6c40039d56d49b7af304fea53079ec9ac838732b8765d",
        "304302203bff8fb0547484a72cd0ef37ede0566d93aa49f5ed2eda8911fd6554d159429c021f0d368faa7edfe213d0aed8d8e6f4fc5053305503eeb9efb644db07d9b5e9ad",
      ]

      const buffers = [
        new Buffer.from(
          'c82920c7d99e0a4055a8459c53362d15f5f8ce275322be8fd2045b43a5ae7f8d478b3856327a4b7809a1f858159bd437e4d93ca480e35bbe21c5cd914b6d722a',
          'hex'),
        new Buffer.from(
          '0464b13a701b9ac16eea29d1604a73d82ba5b3aed1435a8c2c3d4f940a2499ce6be000a5cc605b284ab6c40039d56d49b7af304fea53079ec9ac838732b8765d',
          'hex'),
        new Buffer.from(
          '3bff8fb0547484a72cd0ef37ede0566d93aa49f5ed2eda8911fd6554d159429c000d368faa7edfe213d0aed8d8e6f4fc5053305503eeb9efb644db07d9b5e9ad',
          'hex'),
      ]
      signatures.forEach((sig, index) => {
        expect(multisigSignatureBuffer(sig)).toEqual(buffers[index]);
      });
    });
  });

});
