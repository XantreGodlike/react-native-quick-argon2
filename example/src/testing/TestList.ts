import type { TestItemType } from '../navigators/children/Entry/TestItemType';
import { describe, it } from './MochaRNAdapter';
import chai from 'chai';
import { registerArgon2Tests } from './Tests/Argon2Tests';

export const TEST_LIST: Array<TestItemType> = [
  {
    description: 'SimpleTests',
    value: false,
    registrator: () => {
      describe('basic tests', () => {
        it('basic 2 + 2 = 4', () => {
          chai.expect(2 + 2).to.be.eql(4);
        });

        it('2 + 2 = 3', () => {
          chai.expect(2 + 2).to.be.eql(3);
        });
      });
    },
  },
  {
    value: false,
    description: 'argon2',
    registrator: registerArgon2Tests
  }
  ];
