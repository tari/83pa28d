---
title: Day 22
subtitle: Low-level Key Input
difficulty: 4
prev-lesson: day21
next-lesson: day23
---

The Key Port
------------

It's called low-level because we interface with the keypad hardware
itself instead of going through an API (that's a pretty glamourous
description of `GetKey`) that does it for us. That's why it'll be
complicated, but faaaaaaaaaaast.

`OUT (n), A`
:    Sends a byte to port `n` via the accumulator.
`OUT (C), reg`
:    Sends a byte to port `C` via register `reg`.
`IN A, (n)`
:    Receives a byte from port `n` via the accumulator. Does not affect
     flags.
`IN reg, (C)`
:    Receives a byte from port `C` via register `reg`.

     S
     :    affected
     Z
     :    affected
     P/V
     :    detects parity
     C
     :    affected

A port is a device that lets the CPU transfer bytes between other pieces
of otherwise unconnected hardware. What's that? You want an analogy?
Okay, imagine you wanted to get a car from Yokohama to San Francisco;
you couldn't just drive it over because they're separated by thousands
of miles of open ocean. Instead, you'd take the car to the *port* of
Yokohama, have a boat take it to the *port* in San Francisco, and drive
off. Similarly, the CPU and the keypad have no real connection, so the
port is used to interact.

The keyport on the TI-83 Plus is port \#1, so we replace *`n`* in the
two instructions with 1.

The first thing to do is enable the key group we want to read from. This
is done by sending the value of that group to the key port. We then read
from the key port and check the value returned. You can get the values
from this table.

| Group \\ Key Code | FE | FD | FB | F7 | EF | DF | BF | 7F |
|-------------------|----|----|----|----|----|----|----|----|
| BF | GRAPH | TRACE | ZOOM | WINDOW | Y= | 2nd | MODE | DEL |
| DF | | STO | LN | LOG | x^2^ | x^-1^ | MATH | ALPHA |
| EF | 0 | 1 | 4 | 7 | , | SIN | APPS | X, T, θ, *n* |
| F7 | . | 2 | 5 | 8 | ) | COS | PRGM | STAT |
| FB | (-) | 3 | 6 | 9 | ( | TAN | VARS | |
| FD | ENTER | + | - | × | ÷ | \^ | CLEAR | |
| FE | down | left | right | up | | | | |

Switching Groups
----------------

Assemble and run this program. When the program is requesting input,
enter <kbd>x</kbd> or <kbd>-></kbd>, because I said so.

### Program 22-1

    ReadKey:
        LD     A, %11111101    ; Check for [-]
        OUT    (1), A
        IN     A, (1)
        CP     %11111011
        JP     Z, Minus

        LD     A, %11111110    ; Check for [up]
        OUT    (1), A
        IN     A, (1)
        CP     %11110111
        JP     Z, Up

        JP     ReadKey

    Minus:
        LD     HL, zs_minus
        b_call(_PutS)
        RET

    Up:
        LD     HL, zs_up
        b_call(_PutS)
        RET

    zs_up:    .DB "You pressed UP !", 0
    zs_minus: .DB "You pressed -  !", 0

Well that certainly was unexpected. You see, compared to a running
program, hardware takes a very long time to react to inputs. So long in
fact, that a program can easily execute several instructions before a
port is ready. In the case of this program, the key port was read before
it could set the correct group. In the case where <kbd>x</kbd> is pressed,

1.  Group \$FD was set, which is the same group for <kbd>down</kbd> and <kdb>x</kbd>.
2.  The key port was read while it was reacting to the group switch and
    so garbage was read.
3.  Group \$FE was set.
4.  The key port was read before it could switch from key group \$FD, so
    the <kbd>x</kbd> key was stored in A.
5.  A was compared with the key code for <kbd>up</kbd>, which just so happens to
    also be the key code for <kbd>x</kbd>, and the rest is history.

To fix this, add a delay of two NOPs between setting the key group and
reading the port. NOP is a do-nothing instruction that just waits for
four clock cylces. It's so pointless it doesn't even get its own box.

Simultaneous Keypresses

You could use either CP or BIT to check the key code. To see the
difference, run Program 22-2. Press and hold <kbd>ALPHA</kbd>, and hit <kbd>LOG</kbd>...
nothing happens. Replace the `CP     %11110111` with `BIT 3, A` and
reassemble. Do the same thing when running this program... `Done`!

### Program 22-2

Pause until <kbd>LOG</kbd> is pressed.

    Loop:
        LD     A, %11011111    ; Enable group
        OUT    (1), A

        IN     A, (1)          ; Input a key
        CP     %11110111      ; Check if it's [LOG]
        RET    Z              ; End if so

        JP     Loop

The reason for this behaviour lies in the way the key port reacts when
multiple keys are pressed. If both *key1* and *key2* are pressed at the
same time, the key port sends the keycode *key1* AND *key2*.

In Program 22-2 then, the key port was sending the bitwise AND of <kbd>LOG</kbd>
and <kbd>ALPHA</kbd> which is `%01110111`. CP didn't work because it was looking
for the exact value `%11110111`. BIT, on the other hand, will work
because bit 3 is still zero.

If you want the calcultor to do something when a key is pressed,
regardless of whether any other keys in the group are pressed, you
should use BIT (or a shift instruction if possible). However, if you
wanted a different action to be taken when two or more keys are pressed
down, then you'd have to either use CP, or have a kind of a BIT chain.

### Program 22-3

Demonstration of multiple keypresses.

     
        b_call(_RunIndicOff)
        LD     HL, $1C23
        LD     (x_pos), HL

    DispText:
        b_call(_ClrLCDFull)
        LD     HL, (x_pos)
        LD     (PenCol), HL
        LD     HL, string
        b_call(_VPutS)

        LD     C, 1

    InKey:
        LD     A, %10111111    ; Check for [DEL] to exit
        OUT    (C), A
        IN     A, (C)
        BIT    7, A
        JR     NZ, InArrow

        LD     A, $FF          ; Reset key port
        OUT    (C), A
        RET

    InArrow:
        LD     A, $FF          ; Reset key port
        OUT    (C), A

        LD     A, %11111110
        OUT    (C), A
        IN     B, (C)

        BIT    0, B
        JP     Z, Down
        BIT    1, B
        JP     Z, Left
        BIT    2, B
        JP     Z, Right
        BIT    3, B
        JP     Z, Up

        JP     InKey

    Down:
        CALL   MoveDown
        BIT    1, B
        CALL   Z, MoveLeft
        BIT    2, B
        CALL   Z, MoveRight
        JP    DispText

    Left:
    ;There is no need to check for Down key anymore.
        CALL   MoveLeft
        BIT    3, B
        CALL   Z, MoveUp
        JP     DispText

    Right:
        CALL   MoveRight
        BIT    3, B
        CALL   Z, MoveUp
        JP     DispText

    Up:
        CALL   MoveUp
        JP     DispText

    MoveDown:
        LD     A, (y_pos)        ; Check if at bottom edge of screen
        CP     57
        RET    Z
        INC    A                ; Down one pixel
        LD     (y_pos), A
        RET

    MoveUp:
        LD     A, (y_pos)        ; Check if at top edge of screen
        OR     A
        RET    Z
        DEC    A                ; Up one pixel
        LD     (y_pos), A
        RET

    MoveLeft:
        LD     A, (x_pos)        ; Check if at left edge of screen
        OR     A
        RET    Z

        DEC    A                ; Left one pixel
        LD     (x_pos), A
        RET

    MoveRight:
        LD     A, (x_pos)        ; Check if at right edge of screen
        CP     96-28            ; 96 - number of pixels the string takes up
        RET    Z

        INC    A                ; Right one pixel
        LD     (x_pos), A
        RET

    x_pos:     .DB    0
    y_pos:     .DB    0
    string:    .DB    "Let\'s Go!", 0
