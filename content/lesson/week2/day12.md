---
title: "Day 12: Key Input"
---


If you want to have any kind of interactivity with your programs, you'll
have to know how to get input from the user by detecting keypresses.

There are three methods of getting a keypress. The two that this lesson
covers involve simple ROM calls. The third is more complex, and is
really only useful for games, so it'll be taken care of later.

## Getting Input With GetKey

{{% infobox _GetKey "Pauses the program until a key is pressed." %}}
Outputs
: A
  : [Key code]({{% ref "keycodes.md" %}}) of key pressed, or 0 if the <kbd>ON</kbd>
    key was pressed.

Destroys
: BC, DE, HL
{{% /infobox %}}

While `GetKey` is waiting for a key, you can do all sorts of things...

-   Change the contrast (like you normally would).
-   Get screen shots with the Graph Link.
-   Turn the calculator off by hitting <kbd>2nd</kbd><kbd>ON</kbd>. In this
    case, the program will terminate.

The third feature is bad: It will cause a memory leak. This means that
the RAM the program takes up won't be reclaimed until you reset. To
avoid this so you can exit the program manually:

This is an undocumented ROM call. You must put `_GetKeyRetOff .EQU
$500B` in your program.

{{% infobox _GetKeyRetOff
    "Exactly the same as `GetKey`, except that <kbd>2nd</kbd><kbd>ON</kbd> combination will return `kOff` in A." %}}
Location
: $500B

Bit `7, (IY + $28)` is set. You will learn what this means later.
{{% /infobox %}}

Something about `GetKeyRetOff` you should know: once you execute one
`GetKeyRetOff`, all subsequent `_GetKey`s will behave similarly. This includes
the `_GetKey` that the TI-OS is running at the homescreen, so you won't be able
to turn off the calculator immediately after quitting the program. You need to
press <kbd>2nd</kbd><kbd>Quit</kbd> or go into certain menus to turn this effect
off.

### Program 12-1

This program couldn't be simpler. It waits for a key, then outputs the
keycode.

        bcall(_ClrLCDFull)
        LD     HL, 0
        LD     (CurRow), HL
        bcall(_GetKey)    ; Get a key
        LD     H, 0
        LD     L, A         ; Store A in HL
        bcall(_DispHL)
        bcall(_NewLine)   ; This will shift the "Done" message down one line.
        RET

## Run Indicator
Run this program a few times, hit a few keys, yada-yada-yada. But look
at the top-right part of the screen when `GetKey` is running. You should
see the Run Indicator, the little line scrolling up continuously. Isn't
that just slightly annoying? Of course it is. So let's inspire some envy
in all those BASIC programmers, and get rid of it.

{{% infobox _RunIndicOff "Deactivates the Run Indicator." /%}}

And, if you want, its opposite.

{{% infobox _RunIndicOn "Activates the Run Indicator." /%}}

Suppose you only want to accept certain keys. Well, in that case, you'd
call `GetKey`, follow it with your CPs and jump if a valid key was
pressed, or loop back to the `GetKey` otherwise.

### Program 12-2

This program will demonstrate using `GetKey` in a loop. You use the up
and down arrow keys to change the number, and press <kbd>CLEAR</kbd> to
terminate.

        bcall(_RunIndicOff)       ; Kill the run indicator.
        bcall(_ClrLCDFull)
        LD     B, 127
        JR     Display    ; Display initial value of B.
    KeyLoop:
        PUSH   BC         ; This will prevent B from being destroyed by _GetKey.
        bcall(_GetKey)
        POP    BC
        CP     kUp        ; If the up arrow key was pressed.
        JR     Z, Increase
        CP     kDown      ; If the down arrow key was pressed.
        JR     Z, Decrease
        CP     kClear     ; If the CLEAR key was pressed.
        RET    Z
        JR     KeyLoop    ; If any other key was pressed, redo _GetKey.
    Increase:
        LD     A, B
        CP     255        ; Don't increment B if it's at its maximum value.
        JR     Z, KeyLoop
        INC    B
        JR     Display    ; Display new value of B.
    Decrease:
        LD     A, B
        CP     0          ; Don't decrement B if it's at its minimum value.
        JR     Z, KeyLoop
        DEC    B
    Display:
        LD     HL, 0       ; Reset cursor to top of screen.
        LD     (CurRow), HL
        LD     L, B
        PUSH   BC         ; Prevent B from destruction at the hands of _DispHL.
        bcall(_DispHL)
        POP    BC
        JR     KeyLoop    ; Get another key.

## Getting Input With GetCSC

{{% infobox _GetCSC "Gets a key. Unlike `GetKey`, does not wait." %}}
Outputs
: A
  : [Scan code]({{% ref "scancodes.md" %}}) of key pressed, or 0 if no key was pressed.

Destroys
: HL
{{% /infobox %}}

`GetCSC` does not support any of the special features `GetKey` does. It
also doesn't support 2nd or Alpha shift keys. It is a little faster than
`GetKey`, and it also doesn't destroy as many registers.

### Program 12-3

Okay, Program 12-3 will do the exact same thing as Program 12-2, except
now `GetCSC` will be used.

        bcall(_RunIndicOff)
        bcall(_ClrLCDFull)
        LD     B, 127
        JR     Display    ; Display initial value of B.
    KeyLoop:
        bcall(_GetCSC)
        CP     skUp       ; If the up arrow key was pressed.
        JR     Z, Increase
        CP     skDown     ; If the down arrow key was pressed.
        JR     Z, Decrease
        CP     skClear    ; If the CLEAR key was pressed.
        RET    Z
        JR     KeyLoop    ; If any other key was pressed, or none, redo _GetCSC.
    Increase:
        LD     A, B
        CP     255        ; Don't increment B if it's at its maximum value.
        JR     Z, KeyLoop
        INC    B
        JR     Display    ; Display new value of B.
    Decrease:
        LD     A, B
        CP     0          ; Don't decrement B if it's at its minimum value.
        JR     Z, KeyLoop
        DEC    B
        JR     Display    ; Display new value of B.
    Display:
        LD     HL, 0       ; Reset cursor to top of screen.
        LD     (CurRow), HL
        LD     L, B
        PUSH   BC         ; Prevent B from destruction at the hands of _DispHL.
        bcall(_DispHL)
        POP    BC
        JR     KeyLoop    ; Get another key.

