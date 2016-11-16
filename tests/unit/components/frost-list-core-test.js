import {expect} from 'chai'
import Ember from 'ember'
const {
  A,
  run
} = Ember
import {describeComponent} from 'ember-mocha'
import PropTypeMixin from 'ember-prop-types'
import {
  beforeEach,
  describe,
  it
} from 'mocha'
import sinon from 'sinon'

describeComponent(
  'frost-list-core',
  'Unit: FrostListCoreComponent',
  {
    unit: true
  },
  function () {
    let component

    beforeEach(function () {
      component = this.subject()
    })

    it('includes className frost-list', function () {
      expect(component.classNames).to.include('frost-list')
    })

    it('includes className frost-list-core', function () {
      expect(component.classNames).to.include('frost-list-core')
    })

    it('sets default property values correctly', function () {
      expect(
        component.get('alwaysUseDefaultHeight'),
        'alwaysUseDefaultHeight: false'
      ).to.be.false

      expect(
        component.get('idForFirstItem'),
        'idForFirstItem: null'
      ).to.be.null

      expect(
        component.get('key'),
        'key: @identity'
      ).to.eql('@identity')

      expect(
        component.get('scrollPosition'),
        'scrollPosition: 0'
      ).to.eql(0)
    })

    it('sets dependent keys correctly', function () {
      const _recordsDependentKeys = [
        'items.[]'
      ]

      const _hasHeaderDependentKeys = [
        'sorting',
        'expansion'
      ]

      expect(
        component._records._dependentKeys,
        'Dependent keys are correct for _records computed property'
      ).to.eql(_recordsDependentKeys)

      expect(
        component._hasHeader._dependentKeys,
        'Dependent keys are correct for _hasHeader computed property'
      ).to.eql(_hasHeaderDependentKeys)
    })

    it('has the expected Mixins', function () {
      expect(
        PropTypeMixin.detect(component),
        'PropTypeMixin Mixin is present'
      ).to.be.true
    })

    it('"_records" computed property', function () {
      run(() => { component.set('items', Ember.A([1, 2, 3, 4])) })

      expect(
        component.get('_records'),
        'item arrays are identical'
      ).to.eql(Ember.A([1, 2, 3, 4]))
    })

    describe('"_hasHeader" computed property', function () {
      it('is set to "true" when "sorting" and "expansion" are set', function () {
        const sorting = {sortProperty: 'sortProperty'}
        const expansion = {expansion: 'expansionMethod'}

        run(() => {
          component.set('sorting', sorting)
          component.set('expansion', expansion)
        })

        expect(
          component.get('_hasHeader'),
          '_hasHeader: "true"'
        ).to.be.true
      })

      it('is set to "true" when "sorting" is set', function () {
        const sorting = {sortProperty: 'sortProperty'}

        run(() => component.set('sorting', sorting))

        expect(
          component.get('_hasHeader'),
          '_hasHeader: "true"'
        ).to.be.true
      })

      it('is set to "true" when "expansion" is set', function () {
        const expansion = {expansion: 'expansionMethod'}

        run(() => component.set('expansion', expansion))

        expect(
          component.get('_hasHeader'),
          '_hasHeader: "true"'
        ).to.be.true
      })

      it('is set to "false" when "sorting" and "expansion" are NOT set', function () {
        expect(
          component.get('_hasHeader'),
          '_hasHeader: "false"'
        ).to.be.false
      })
    })

    describe('"checkExpansionValidity" function', function () {
      it('returns "true" when expansion is set Properly', function () {
        const expansion = {
          onCollapseAll: function () {},
          onExpandAll: function () {}
        }

        expect(
          component.checkExpansionValidity(expansion),
          'isExpansionValid: "true"'
        ).to.be.true
      })

      it('returns "false" when "onExpandAll" function is missing in "expansion"', function () {
        const expansion = {
          onExpandAll: function () {}
        }

        expect(
          component.checkExpansionValidity(expansion),
          'isExpansionValid: false'
        ).to.be.false
      })

      it('returns "false" when "onCollapseAll" function is missing in "expansion"', function () {
        const expansion = {
          onCollapseAll: function () {}
        }

        expect(
          component.checkExpansionValidity(expansion),
          'isExpansionValid: false'
        ).to.be.false
      })
    })

    describe('"checkSelectionValidity" function', function () {
      it('returns "true" when "selection" is set Properly', function () {
        const selection = {
          onSelect: function () {}
        }

        expect(
          component.checkSelectionValidity(selection),
          'isSelectionValid: true'
        ).to.be.true
      })

      it('returns "false" when "onSelect" function is missing in "selection"', function () {
        const selection = {}

        expect(
          component.checkSelectionValidity(selection),
          'isSelectionValid: true'
        ).to.be.false
      })
    })

    describe('"checkSortingValidity" function', function () {
      it('returns "false" when "sorting" is NOT set properly', function () {
        const sorting = {}

        expect(
          component.checkSortingValidity(sorting),
          'isSortingValid: false'
        ).to.be.false
      })

      it('returns "false" when "activeSorting" and "properties" are missing in "sorting"', function () {
        const sorting = {
          onSort: function () {}
        }

        expect(
          component.checkSortingValidity(sorting),
          'isSortingValid: false'
        ).to.be.false
      })

      it('returns "false" when "activeSorting" is missing in "sorting"', function () {
        const sorting = {
          onSort: function () {},
          properties: []
        }

        expect(
          component.checkSortingValidity(sorting),
          'isSortingValid: false'
        ).to.be.false
      })

      it('returns "true" when "sorting" is set properly', function () {
        const sorting = {
          onSort: function () {},
          properties: [],
          activeSorting: []
        }

        expect(
          component.checkSortingValidity(sorting),
          'isSortingValid: true'
        ).to.be.true
      })
    })

    describe('"_findElementsInBetween" function', function () {
      let array = []
      for (let i = 0; i < 10; i++) {
        array.push({
          id: i
        })
      }

      it('returns result array when all attributes are provided', function () {
        expect(
          component._findElementsInBetween(array, array[2], array[6]).length,
          'isSelectionValid: "true"'
        ).to.eql(5)
      })

      it('returns last element when "firstElement" is missing', function () {
        let result = component._findElementsInBetween(array, undefined, array[6])
        expect(
          result.length,
          'result array contains one element'
        ).to.eql(1)

        expect(
          result[0].id,
          'result: {id: 6}'
        ).to.eql(6)
      })
    })

    describe('"selectItem" action', function () {
      const testItems = A([
        {
          id: '1'
        },
        {
          id: '2'
        },
        {
          id: '3'
        }
      ])

      it('updates persistedClickState with correct object', function () {
        const persistedClickState = {
          clickedRecord: {
            id: '1'
          },
          isSelected: true
        }

        const updatedPersistedClickState = {
          clickedRecord: {
            id: '3'
          },
          isSelected: true
        }
        const mockAttrs = {
          selectDesc: {
            isSelected: true,
            isTargetSelectionIndicator: false
          },
          record: {
            id: '3'
          }
        }
        run(() => component.set('persistedClickState', persistedClickState))

        component.send('selectItem', {}, mockAttrs)

        expect(
          component.get('persistedClickState'),
          'persistedClickState is updated'
        ).to.eql(updatedPersistedClickState)
      })

      it('triggers shiftKey selection', function () {
        const mockEvent = {
          shiftKey: true
        }

        const mockAttrs = {
          selectDesc: {
            isSelected: true,
            isTargetSelectionIndicator: false
          },
          record: {
            id: '3'
          }
        }

        const mockPersistedClickState = {
          isSelected: true,
          clickedRecord: {
            id: '1'
          }
        }
        const resultObject = {
          records: [
            {
              id: '1'
            },
            {
              id: '2'
            },
            {
              id: '3'
            }
          ],
          selectDesc: {
            isSelected: true,
            isTargetSelectionIndicator: false,
            isShiftSelect: true
          }
        }
        run(() => {
          component.set('onSelect', sinon.spy())
          component.set('_records', testItems)
          component.set('persistedClickState', mockPersistedClickState)
        })

        component.send('selectItem', mockEvent, mockAttrs)

        expect(
          component.get('onSelect').calledWith(resultObject),
          'calls onSelect() with the correct object'
        ).to.be.true
      })

      it('triggers single item selection', function () {
        const mockEvent = {
          shiftKey: false
        }

        const mockAttrs = {
          selectDesc: {
            isSelected: true,
            isTargetSelectionIndicator: false
          },
          record: {
            id: '1'
          }
        }

        const resultObject = {
          records: [
            {
              id: '1'
            }
          ],
          selectDesc: {
            isSelected: true,
            isTargetSelectionIndicator: false,
            isShiftSelect: false
          }
        }
        run(() => {
          component.set('onSelect', sinon.spy())
          component.set('_records', testItems)
        })

        component.send('selectItem', mockEvent, mockAttrs)

        expect(
          component.get('onSelect').calledWith(resultObject),
          'calls onSelect() with the correct object'
        ).to.be.true
      })
    })
  }
)
