# wimfla

What Is My F^%$# Layout Again?

---

### Usage with ZMK
- set driver in config.json to "zmk"
- Make the changes to your config below;

#### your_board.conf
```
# Turn on logging, and set ZMK logging to debug output
CONFIG_LOG=y
CONFIG_ZMK_LOG_LEVEL_DBG=y
CONFIG_ZMK_USB_LOGGING=y
```
### Usage with QMK
- set driver in config.json to "qmk"
- Make the changes to your config below;

#### rules.mk
```cpp
CONSOLE_ENABLE = yes
```

#### keymap.c 
```cpp
uint32_t layer_state_set_user(uint32_t state) {
   if (is_keyboard_master()) {
  switch (biton32(state)) {
               case _QWERTY:
                uprintf("layer:QWERTY\n");
                break;
            case _DVORAK:
                uprintf("layer:Dvorak\n");
                break;
            case _COLEMAK_DH:
                uprintf("layer:Colemak-DH\n");
                break;
            case _NAV:
                uprintf("layer:Nav\n");
                break;
            case _SYM:
                uprintf("layer:Sym\n");
                break;
            case _FUNCTION:
                uprintf("layer:Function\n");
                break;
            case _ADJUST:
                uprintf("layer:Adjust\n");
                break;
            default:
                uprintf("layer:Undefined\n");
  }
}
  return state;
}
```
