/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-new, no-unused-expressions */
const expect = require('chai').expect;

const fail = expect.fail;
const JDLUnaryOption = require('../../../lib/core/jdl_unary_option');
const JDLEntity = require('../../../lib/core/jdl_entity');
const UnaryOptions = require('../../../lib/core/jhipster/unary_options').Options;

describe('JDLUnaryOption', () => {
  describe('::new', () => {
    context('when passing no argument', () => {
      it('fails', () => {
        try {
          new JDLUnaryOption();
          fail();
        } catch (error) {
          expect(error.name).to.eq('NullPointerException');
        }
      });
    });
    context('when passing an invalid name', () => {
      it('fails', () => {
        try {
          new JDLUnaryOption({ name: 'IsNotAnOption' });
          fail();
        } catch (error) {
          expect(error.name).to.eq('IllegalArgumentException');
          expect(error.message).to.eq('The option\'s name must be valid, got \'IsNotAnOption\'.');
        }
      });
    });
    context('when passing a name at least', () => {
      let option = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
      });

      it('creates an option', () => {
        expect(option.name).to.eq(UnaryOptions.SKIP_CLIENT);
      });
    });
    context('when passing a list of entity names and excluded names with some of them being repeated', () => {
      let option = null;

      before(() => {
        option = new JDLUnaryOption({
          name: UnaryOptions.SKIP_CLIENT,
          entityNames: ['A', 'B', 'C', 'A'],
          excludedNames: ['E', 'E', 'D']
        });
      });

      it('removes the dupes', () => {
        expect(option.entityNames.size()).to.eq(3);
        expect(option.entityNames.has('A')).to.be.true;
        expect(option.entityNames.has('B')).to.be.true;
        expect(option.entityNames.has('C')).to.be.true;
        expect(option.excludedNames.size()).to.eq(2);
        expect(option.excludedNames.has('E')).to.be.true;
        expect(option.excludedNames.has('D')).to.be.true;
      });
    });
  });
  describe('#setEnityNames', () => {
    let option = null;

    before(() => {
      option = new JDLUnaryOption({
        name: UnaryOptions.SKIP_CLIENT,
        entityNames: ['A', 'B', 'C']
      });
      option.setEntityNames(['A']);
    });

    it('sets the entity names', () => {
      expect(option.entityNames.size()).to.equal(1);
      expect(option.entityNames.has('A')).to.be.true;
    });
  });
  describe('::isValid', () => {
    context('when passing a nil object', () => {
      it('returns false', () => {
        expect(JDLUnaryOption.isValid()).to.be.false;
      });
    });
    context('when passing an object with no name', () => {
      it('returns false', () => {
        expect(JDLUnaryOption.isValid({})).to.be.false;
      });
    });
    context('when passing an object with a name', () => {
      it('returns false', () => {
        expect(JDLUnaryOption.isValid({ name: UnaryOptions.SKIP_CLIENT })).to.be.false;
      });
    });
    context('when passing an object with a name, entity names and excluded names', () => {
      let emptyOption = null;

      before(() => {
        emptyOption = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
      });

      it('returns true', () => {
        expect(
          JDLUnaryOption.isValid({
            name: UnaryOptions.SKIP_CLIENT,
            entityNames: emptyOption.entityNames,
            excludedNames: emptyOption.excludedNames,
            getType: () => 'UNARY'
          })
        ).to.be.true;
      });
    });
  });
  describe('#addEntity', () => {
    context('when passing a nil entity', () => {
      let option = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
      });

      it('fails', () => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
        try {
          option.addEntity(null);
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(error.message).to.eq('The passed entity must be valid.\nErrors: No entity');
        }
      });
    });
    context('when passing an invalid entity', () => {
      let option = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
      });

      it('fails', () => {
        try {
          option.addEntity({});
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(
            error.message
          ).to.eq('The passed entity must be valid.\nErrors: No entity name, No table name, No fields object');
        }
      });
    });
    context('when passing a valid entity that hasn\'t been added yet', () => {
      let option = null;
      let result = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
        result = option.addEntity(new JDLEntity({ name: 'A' }));
      });

      it('returns true', () => {
        expect(result).to.be.true;
      });
      it('changes the size', () => {
        expect(option.entityNames.size()).to.eq(1);
      });
    });
    context('when passing a valid entity that has already been added', () => {
      let option = null;
      let result = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
        option.addEntity(new JDLEntity({ name: 'A' }));
        result = option.addEntity(new JDLEntity({ name: 'A' }));
      });

      it('returns false', () => {
        expect(result).to.be.false;
      });
      it('does not change the size', () => {
        expect(option.entityNames.size()).to.eq(1);
      });
    });
    context('when passing an excluded entity', () => {
      let option = null;
      let result = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
        option.addEntity(new JDLEntity({ name: 'A' }));
        result = option.excludeEntity(new JDLEntity({ name: 'A' }));
      });

      it('returns false', () => {
        expect(result).to.be.false;
      });
      it('does not change the sizes', () => {
        expect(option.entityNames.size()).to.eq(1);
        expect(option.excludedNames.size()).to.eq(0);
      });
    });
  });
  describe('#addEntitiesFromAnotherOption', () => {
    let option = null;

    before(() => {
      option = new JDLUnaryOption({
        name: UnaryOptions.SKIP_SERVER,
        entityNames: ['B', 'C'],
        excludedNames: ['Z']
      });
    });

    context('when passing an invalid option', () => {
      it('returns false', () => {
        expect(option.addEntitiesFromAnotherOption(null)).to.be.false;
      });
    });
    context('when passing a valid option', () => {
      let returned;

      before(() => {
        const option2 = new JDLUnaryOption({
          name: UnaryOptions.SKIP_SERVER,
          entityNames: ['A', 'C'],
          excludedNames: ['Y']
        });
        returned = option.addEntitiesFromAnotherOption(option2);
      });

      it('returns true', () => {
        expect(returned).to.be.true;
      });
      it('adds the source entities to the target option', () => {
        expect(option.entityNames.toString()).to.equal('[B,C,A]');
      });
      it('adds the excluded source entities to the target option', () => {
        expect(option.excludedNames.toString()).to.equal('[Z,Y]');
      });
    });
  });
  describe('#excludeEntity', () => {
    context('when passing a nil entity', () => {
      let option = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
      });

      it('fails', () => {
        try {
          option.excludeEntity(null);
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(error.message).to.eq('The passed entity must be valid.\nErrors: No entity');
        }
      });
    });
    context('when passing an invalid entity', () => {
      let option = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
      });

      it('fails', () => {
        try {
          option.excludeEntity({});
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(
            error.message
          ).to.eq('The passed entity must be valid.\nErrors: No entity name, No table name, No fields object');
        }
      });
    });
    context('when passing a valid entity that hasn\'t been excluded yet', () => {
      let option = null;
      let result = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
        result = option.excludeEntity(new JDLEntity({ name: 'A' }));
      });

      it('returns true', () => {
        expect(result).to.be.true;
      });
      it('changes the size', () => {
        expect(option.excludedNames.size()).to.eq(1);
      });
    });
    context('when passing a valid entity that has already been excluded', () => {
      let option = null;
      let result = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
        option.excludeEntity(new JDLEntity({ name: 'A' }));
        result = option.excludeEntity(new JDLEntity({ name: 'A' }));
      });

      it('returns false', () => {
        expect(result).to.be.false;
      });
      it('does not change the size', () => {
        expect(option.excludedNames.size()).to.eq(1);
      });
    });
    context('when passing an added entity', () => {
      let option = null;
      let result = null;

      before(() => {
        option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
        option.excludeEntity(new JDLEntity({ name: 'A' }));
        result = option.addEntity(new JDLEntity({ name: 'A' }));
      });

      it('returns false', () => {
        expect(result).to.be.false;
      });
      it('does not change the size', () => {
        expect(option.entityNames.size()).to.eq(1);
      });
    });
  });
  describe('#toString', () => {
    it('stringifies the option', () => {
      const option = new JDLUnaryOption({ name: UnaryOptions.SKIP_CLIENT });
      expect(option.toString()).to.eq(`${UnaryOptions.SKIP_CLIENT} *`);
      option.addEntity(new JDLEntity({ name: 'D' }));
      expect(option.toString()).to.eq(`${UnaryOptions.SKIP_CLIENT} D`);
      option.addEntity(new JDLEntity({ name: 'E' }));
      option.addEntity(new JDLEntity({ name: 'F' }));
      expect(option.toString()).to.eq(`${UnaryOptions.SKIP_CLIENT} D, E, F`);
      option.excludeEntity(new JDLEntity({ name: 'A' }));
      expect(option.toString()).to.eq(`${UnaryOptions.SKIP_CLIENT} D, E, F except A`);
      option.excludeEntity(new JDLEntity({ name: 'B' }));
      option.excludeEntity(new JDLEntity({ name: 'C' }));
      expect(option.toString()).to.eq(`${UnaryOptions.SKIP_CLIENT} D, E, F except A, B, C`);
    });
  });
});
