import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, beforeEach as setup } from 'vitest';
import '../testing/mocks/pglite.mock';
import '../testing/mocks/haptics.mock';
import { mockDb } from '../testing/mocks/pglite.mock';
import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    await component.ngOnInit();
    fixture.detectChanges();
  });

  describe('when the app INITIALISES', () => {
    describe('after initialisation HAS FINISHED', () => {
      it('should SET the loading state', () => {
        expect(component.isLoading()).toBe(false);
      });
    });
  });

  describe('when a collectible IS CLICKED', () => {
    describe('when the collectible HAS NOT been marked as collected', () => {
      const mockItem = {
        id: 1,
        name: 'Bitterling',
        category: 'fish' as const,
        price: 900,
        caught: false,
      };

      setup(async () => {
        component.items.set([mockItem]);
        await component.toggleCaught(mockItem);
      });

      it('should set the item caught state to TRUE', () => {
        expect(component.items()[0].caught).toBe(true);
      });

      it('should UPDATE the database', () => {
        expect(mockDb.query).toHaveBeenCalledWith(
          'UPDATE catch_tracker SET caught = $1 WHERE id = $2;',
          [true, 1]
        );
      });
    });

    describe('when the collectible HAS been marked as collected', () => {
      const mockItem = {
        id: 1,
        name: 'Bitterling',
        category: 'fish' as const,
        price: 900,
        caught: true,
      };

      setup(async () => {
        component.items.set([mockItem]);
        await component.toggleCaught(mockItem);
      });

      it('should set the item caught state to FALSE', () => {
        expect(component.items()[0].caught).toBe(false);
      });

      it('should UPDATE the database', () => {
        expect(mockDb.query).toHaveBeenCalledWith(
          'UPDATE catch_tracker SET caught = $1 WHERE id = $2;',
          [false, 1]
        );
      });
    });
  });
});