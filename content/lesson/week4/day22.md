---
title: "Day 22: Low-level Key Input"
---

The Key Port
------------

It's called low-level because we interface with the keypad hardware
itself instead of going through an API (that's a pretty glamourous
description of `GetKey`) that does it for us. That's why it'll be
complicated, but faaaaaaaaaaast.

{{% infobox "OUT (n), A" "Sends a byte to port `n` via the accumulator." /%}}
{{% infobox "OUT (C), reg" "Sends a byte to port `C` via register `reg`." /%}}
{{% infobox "IN A, (n)" "Receives a byte from port `n` via the accumulator. Does not affect flags." /%}}
{{% infobox "IN reg, (C)" "Receives a byte from port `C` via register `reg`." %}}
S
: affected

Z
: affected

P/V
: detects parity

C
: affected
{{% /infobox %}}

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
is done by writing a value to the key port with the bit corresponding to
the chosen group set to 0. Then read from the key port, and the value that
comes back has a bit set to 0 for each key that is currently pressed in
the selected group.

### Matrix layout

So what are these group and key bits? Glad you asked!  The keyboard matrix is
laid out so the group and key bits are like this:[^matrix]

[^matrix]: In hardware, the keyboard is a matrix of switches where pressing one
  key connects a row to a column- writing a 0 for a group selects a row, then
reading a value shows the current state of the columns. If a key is pressed, 
the column takes on the same value as its row.

<table>
    <tr>
        <th>Group bit</th>
        <th>6</th>
        <th>5</th>
        <th>4</th>
        <th>3</th>
        <th>2</th>
        <th>1</th>
        <th>0</th>
    </tr>
    <tr>
        <th>Key bit</th>
    </tr>
    <tr>
        <th>7</th>
        <td><kbd>DEL</kbd></td>
        <td><kbd>ALPHA</kbd></td>
        <td><kbd>X,T,&theta;,<em>n</em></kbd></td>
        <td><kbd>STAT</kbd></td>
    </tr>
    <tr>
        <th>6</th>
        <td><kbd>MODE</kbd></td>
        <td><kbd>MATH</kbd></td>
        <td><kbd>APPS</kbd></td>
        <td><kbd>PRGM</kbd></td>
        <td><kbd>VARS</kbd></td>
        <td><kbd>CLEAR</kbd></td>
    </tr>
    <tr>
        <th>5</th>
        <td><kbd>2nd</kbd></td>
        <td><kbd>x<sup>-1</sup></kbd></td>
        <td><kbd>SIN</kbd></td>
        <td><kbd>COS</kbd></td>
        <td><kbd>TAN</kbd></td>
        <td><kbd>^</kbd></td>
    </tr>
    <tr>
        <th>4</th>
        <td><kbd>Y=</kbd></td>
        <td><kbd>x<sup>2</sup></kbd></td>
        <td><kbd>,</kbd></td>
        <td><kbd>)</kbd></td>
        <td><kbd>(</kbd></td>
        <td><kbd>&divide;</kbd></td>
    </tr>
    <tr>
        <th>3</th>
        <td><kbd>WINDOW</kbd></td>
        <td><kbd>LOG</kbd></td>
        <td><kbd>7</kbd></td>
        <td><kbd>8</kbd></td>
        <td><kbd>9</kbd></td>
        <td><kbd>&times;</kbd></td>
        <td><kbd>up</kbd></td>
    </tr>
    <tr>
        <th>2</th>
        <td><kbd>ZOOM</kbd></td>
        <td><kbd>LN</kbd></td>
        <td><kbd>4</kbd></td>
        <td><kbd>5</kbd></td>
        <td><kbd>6</kbd></td>
        <td><kbd>-</kbd></td>
        <td><kbd>right</kbd></td>
    </tr>
    <tr>
        <th>1</th>
        <td><kbd>TRACE</kbd></td>
        <td><kbd>STO</kbd></td>
        <td><kbd>1</kbd></td>
        <td><kbd>2</kbd></td>
        <td><kbd>3</kbd></td>
        <td><kbd>+</kbd></td>
        <td><kbd>left</kbd></td>
    </tr>
    <tr>
        <th>0</th>
        <td><kbd>GRAPH</kbd></td>
        <td></td>
        <td><kbd>0</kbd></td>
        <td><kbd>.</kbd></td>
        <td><kbd>(-)</kbd></td>
        <td><kbd>ENTER</kbd></td>
        <td><kbd>down</kbd></td>
    </tr>
</table>

Given the description above, if we wanted to check if the <kbd>ENTER</kbd> key
is pressed, we would write the value `$FD` (all ones except for bit 1,
corresponding to the "1" column in the table) to select the group containing the
<kbd>ENTER</kbd> key, and expect the value `$FE` back if the key is currently
being pressed (corresponding to the "0" row in the table).

Note that the most significant group bit is unused, and the <kbd>ON</kbd> key is
missing! <kbd>ON</kbd> is separate from the rest of the keyboard because it
triggers interrupts, so you need to read its state from port 4; this is
explained in more detail in [Day 23]({{% ref "day23.md" %}}).

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
        bcall(_PutS)
        RET

    Up:
        LD     HL, zs_up
        bcall(_PutS)
        RET

    zs_up:    .DB "You pressed UP !", 0
    zs_minus: .DB "You pressed -  !", 0

Well that certainly was unexpected. You see, compared to a running
program, hardware takes a very long time to react to inputs. So long in
fact, that a program can easily execute several instructions before a
port is ready. In the case of this program, the key port was read before
it could set the correct group. In the case where <kbd>x</kbd> is pressed,

1.  Group `$FD` was set, which is the same group for <kbd>down</kbd> and <kbd>x</kbd>.
2.  The key port was read while it was reacting to the group switch and
    so garbage was read.
3.  Group `$FE` was set.
4.  The key port was read before it could switch from key group `$FD`, so
    the <kbd>x</kbd> key was stored in A.
5.  A was compared with the key code for <kbd>up</kbd>, which just so happens to
    also be the key code for <kbd>x</kbd>, and the rest is history.

To fix this, add a delay of two `NOP`s between setting the key group and
reading the port. `NOP` is a do-nothing instruction that just waits for
four clock cycles. It's so pointless it doesn't even get its own box.

## Simultaneous Keypresses

You could use either `CP` or `BIT` to check what keys are pressed, but we've only
used `CP` this far. To see the difference, run Program 22-2. Press and hold
<kbd>ALPHA</kbd>, and hit <kbd>LOG</kbd>...  nothing happens. Replace the `CP
%11110111` with `BIT 3, A` and reassemble. Do the same thing when running this
program... `Done`!

### Program 22-2

Pause until <kbd>LOG</kbd> is pressed.

    Loop:
        LD     A, %11011111    ; Enable group
        OUT    (1), A

        IN     A, (1)          ; Input a key
        CP     %11110111      ; Check if it's [LOG]
        RET    Z              ; End if so

        JP     Loop

---

The reason for this behaviour lies in the way the key port reacts when
multiple keys are pressed. Because the bit for a key is reset when pressed,
if both *key1* and *key2* are pressed at the
same time, you get a value back with the bits corresponding to both *key1* and
*key2* cleared!

In Program 22-2 then, the key port was giving us `%01110111`, with the bits for
both <kbd>LOG</kbd> and <kbd>ALPHA</kbd> cleared.  CP didn't work because it was
looking for the exact value `%11110111`. BIT, on the other hand, will work
because bit 3 is still zero.

---

If you want the calculator to do something when a key is pressed,
regardless of whether any other keys in the group are pressed, you
should use BIT (or a shift instruction if possible). However, if you
wanted a different action to be taken when two or more keys are pressed
down, then you'd have to either use CP, or have a kind of a BIT chain.

### Program 22-3

Demonstration of multiple keypresses.

     
        bcall(_RunIndicOff)
        LD     HL, $1C23
        LD     (x_pos), HL

    DispText:
        bcall(_ClrLCDFull)
        LD     HL, (x_pos)
        LD     (PenCol), HL
        LD     HL, string
        bcall(_VPutS)

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

### Press any key to continue

You can also select multiple key groups at a time, by writing group values to
the key port with multiple bits cleared. The value you get back is equivalent to
taking the bitwise AND of the values that would be returned from each group
individually. This means you might not be able to tell exactly which keys are
pressed, but it's convenient if you only care if a key is pressed and not which
one.

Most usefully, you might want to check if any key (other than <kbd>ON</kbd>) is
pressed by writing `$80` and checking if any bits in the read value are clear
(simply by comparing the result to `$FF`).

## Keyboard b\_calls and debouncing

The calculator's `bcall`s for receiving input do some additional work that may
not be obvious when thinking about low-level input. Try running Program 22-4 and
holding down various keys (one at a time- `_GetCSC` returns nothing if you're
pressing more than one key) while comparing how fast dots are displayed.

### Program 22-4

    Loop:
        bcall(_GetCSC)
        or a            ; Any key pressed?
        jr z, Loop      ; No, keep waiting

        cp skClear
        ret z           ; Press CLEAR to exit

        ld a, '.'
        bcall(_PutC)   ; Display a dot for a keypress
        jr Loop

You should notice that the arrow keys and <kbd>DEL</kbd> will be returned
multiple times after a short delay if held down, while no other keys will. This
is because in most situations the calculator's programmers expected that you
only want to handle new keypresses, and not accidentally holding a key
down:[^edge-trigger] a reasonable assumption for a calculator.

[^edge-trigger]: Electrical engineers refer to this as being "edge-triggered",
  where the transition between two digital states is referred to as an edge. In
this case, the states are "key pressed" and "key not pressed."

On the other hand, if you want to detect a key being held down (perhaps you're
programming a game where <kbd>2nd</kbd> is a shoot button) then your program
needs to use low-level keyboard access to detect that- `_GetCSC`'s helpfulness
is actually a complication in that case!

If you expect keys to be held down then you probably also need to handle
more than one being pressed at a time, which `_GetCSC` will not do for you
either, so especially for games raw key input is very important.
