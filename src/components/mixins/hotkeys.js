import Vue from 'vue';
import { QPARAM_noarrows } from '../../constants';

export const HOTKEY_STEP_BINDINGS = [18, 32, 17]; // alt(left), spacebar(middle), ctrl(right)

var maskState = 0;
var heldMaskState = 0;

export const NO_ARROWS = new URLSearchParams(window.location.search).has(QPARAM_noarrows);

export const COMMANDS = [0, 0, 0, 0, 0, 0, 0, 0];
COMMANDS[1] = 'prevStep';
COMMANDS[4] = 'nextStep';
COMMANDS[2|4] = 'nextSong';
COMMANDS[1|2] = 'prevSong';
COMMANDS[1|2|4] = 'cancel';
COMMANDS[2] = 'select';

export const BUS = new Vue();

function handleChordKeys(state) {
  if (COMMANDS[state]) {
    // do something
    BUS.$emit('hotkeyTriggered', COMMANDS[state]);
  }
}

export const mixin = {
  methods: {
    onKeydownHotBox(e) {

      let index = HOTKEY_STEP_BINDINGS.indexOf(e.keyCode);
      if (index >=0) {
        e.preventDefault();
        maskState |= (1 << index);
        heldMaskState |= (1 << index);
      }
    },
    onKeyupHotBox(e) {

      let index = HOTKEY_STEP_BINDINGS.indexOf(e.keyCode);
      if (index >=0) {
        maskState &= ~(1 << index);
        e.preventDefault();
        if (maskState === 0) {
          handleChordKeys(heldMaskState);
          heldMaskState = 0;
        }
      }
    },
    onTapDummy(e) {
      e.stopPropagation();
    }
  }
}