---
title: "Day 27: String and Numerical Input"
---

There are times when you would like to get input from the user, but you
need something more subtantial than a single keypress. In a game
program, for example, the player has gotten a high score and they want
to enter their name. By the end of today we will have a moderately
complex routine to more or less do what we want.

Specifications
--------------

The first question we should ask ourselves is, "how should this routine
work?" As it turns out, there are a few techniques that the routine can
be based upon. For the first version of our input routine (we will be
adding features to it later), our goals are:

-   Use `_GetCSC` to read a keypress.
-   Accept letters only.
-   Has echo (user sees the characters as he types them) using the large
    character set.
-   Once accepting a key, the letter it corresponds to is stored in a
    buffer in RAM.
-   Should stop after some number of characters are input. 48 seems
    okay.
-   Once it stops, write a zero to the buffer to indicate the end.

From this simple checklist we can make a rough outline of how the code
should be structured.

1.  Initialize the buffer pointer.
2.  Set the buffer counter to zero.
3.  Setup cursor coordinates
4.  Invoke `GetCSC`.
    -   If there wasn't a key pressed,
        1.  Goto "D".
    -   If there was a key pressed,
        1.  If the key pressed was <kbd>ENTER</kbd>, Write a zero and END.
        2.  If the buffer is full, Goto "D".
        3.  Convert the key to the letter it represents.
        4.  Write the letter to the buffer.
        5.  Write the letter to the screen with `PutC`.
        6.  Goto "D".

We now have a rough idea of how the code should be ordered. We should
now think about how to implement each point of the outline in assembly.
Since we are using some of the TIOS system routines, it would be wise to
know what are the side effects of using them. Most of the routines will
alter one or more registers, and this will have an impact on register
use in our code.

* `GetCSC`: destroys AF and HL
* `PutC`: destroys no registers

Building It Up
--------------

Initialize the buffer pointer

For now, let's locate our buffer at TextShadow. We will maintain a
pointer into this buffer to direct where inputted characters are to be
stored. The best place to put this pointer is in HL.

    buffer  .EQU TextShadow

         LD    HL, buffer

Set the buffer counter to zero.

We'll store the number of characters input in B.

    #define BUFSIZE  48

        XOR   A
        LD    B, A

Setup cursor coordinates

We want the cursor position to start in the first column to maximize
usage of horizontal space. We will leave CurRow alone. We could set it
to some value, but the routine doesn't really care, and the programmer
might not like characters appearing at a random location on screen,
overwriting important information.

        LD    (CurCol), A

Invoke `GetCSC`. Because `GetCSC` destroys HL, we have to preserve its value.

        EX    DE, HL
        b_call(_GetCSC)
        EX    DE, HL

If there wasn't a key pressed, Goto "D".

Taking advantage of the fact that `GetCSC` returns zero if no key was
pressed, we can use OR A to check this, and jump to the `GetCSC` if the
Z flag is set. Make a note to put a label before `GetCSC`.

        OR    A
        JR    Z, KeyLoop

If the key pressed was <kbd>ENTER</kbd>, Write a zero and END.

Of course we want the user to be able to tell the routine that he's
finished. He can do this by pressing the <kbd>ENTER</kbd> key. It doesn't have
to be <kbd>ENTER</kbd>, but this choice will be more intuitive to the user.

        CP    skEnter
        JR    NZ, NotEnter
        LD    (HL), 0
        RET

    NotEnter:

If the buffer is full, Goto "D".

We have to make sure that no more than the maximum number of characters
will be input since we haven't made the buffer big enough to hold them.

        LD    C, A
        LD    A, B
        CP    BUFSIZE
        JR    Z, KeyLoop
        LD    A, C

Convert the key to the letter it represents.

Comparing a table of `GetCSC`'s scan codes and a table of character
ASCII codes each key represents (looking at the green letter above each
key). It can be seen that the two have no simple relationship. In this
case, a [lookup table]({{% ref "day13.md#lut" %}}) will be used to do the
conversion.

From the scan code table, we see that all the letter keys are between
`$0A` and `$2F`. We will want to reject all keys that are outside this
range.

        SUB   skAdd
        JR    C, KeyLoop
        CP    skMath - skAdd + 1
        JR    NC, KeyLoop

We used a SUB here because of the nature of arrays. The first element in
all arrays is referenced with an index of zero. Since our input domain
starts with `$0A`, we subtract that number to "massage" the input to
something more compatible. If this wasn't done, we would have to fill
the first eleven entries of the look-up table with a garbage value.

Now the code to convert the character and the contents of the look-up
table. We have to be careful here because the scan codes are not always
sequential, and there are some keys that have no letter assigned to
them. We'll make these keys result in boxes.

        PUSH  HL
        LD    H, 0
        LD    L, A
        LD    DE, CharTable
        ADD   HL, DE
        LD    A, (HL)
        POP   HL

    CharTable:
    .DB   $27, "WRMH", $FF, $FF      ; + - × ÷ ^ undefined
    .DB   "?", $5B, "VQLG", $FF, $FF  ; (-) 3 6 9 ) TAN VARS undefined
    .DB   ":ZUPKFC", $FF, $FF       ; . 2 5 8 ( COS PRGM STAT
    .DB   " YTOJEB", $FF, $FF       ; 0 1 4 7 , SIN APPS XTθn undefined
    .DB   "XSNIDA"               ; STO LN LOG x2 x-1 MATH

Write the letter to the buffer, update pointers and counters.

The character is in A and the place to put it to is in HL.

        LD    (HL), A
        INC   HL
        INC   B

Write the letter to the screen

       b_call(_PutC)

Goto "D"

And do it all over again.

        JR    KeyLoop

Version 1 — The Basics
----------------------

With all the little tasks complete, all that must be done is to combine
them into one routine.

    #define BUFSIZE  48
    buffer    .EQU TextShadow

    GetStr:
        RES   AppTextSave, (IY + AppFlags)
        LD    HL, buffer     ; Init pointer
        XOR   A
        LD    B, A           ; Init character counter
        LD    (CurCol), A

    KeyLoop:
        EX    DE, HL         ; Get a character
        b_call(_GetCSC)
        EX    DE, HL
        OR    A             ; If no character recieved, restart
        JR    Z, KeyLoop

        CP    skEnter      ; If [ENTER] pressed, exit
        JR    NZ, NotEnter

        LD    (HL), 0       ; Null-terminate buffer
        RET

    NotEnter:
        LD    C, A          ; Save input char temporarily
        LD    A, B          ; See if max number of characters input
        CP    BUFSIZE
        JR    Z, KeyLoop
        LD    A, C          ; Restore char

        SUB   skAdd        ; Throw out all keys below [+]
        JR    C, KeyLoop
        CP    skMath - skAdd + 1    ; Throw out all keys above [MATH]
        JR    NC, KeyLoop

        PUSH  HL           ; Convert scan code into character
        LD    H, 0
        LD    L, A
        LD    DE, CharTable
        ADD   HL, DE
        LD    A, (HL)
        POP   HL

        b_call(_PutC)      ; Echo it

        LD    (HL), A       ; Write char to buffer
        INC   HL          ; Increment pointer
        INC   B           ; Increment char counter

        JR    KeyLoop

    CharTable:
    .DB  "'WRMH", 0, 0            ; + - × ÷ ^ undefined
    .DB  "?", LTheta, "VQLG", 0, 0  ; (-) 3 6 9 ) TAN VARS undefined
    .DB  ":ZUPKFC", 0            ; . 2 5 8 ( COS PRGM STAT
    .DB  " YTOJEB", 0, 0          ; 0 1 4 7 , SIN APPS XTθn undefined
    .DB  "XSNIDA"               ; STO LN LOG x2 x-1 MATH

Reading from the Buffer
-----------------------

Now that we have read a string, we want to process the characters input.
The desired routine to do this will return the next character in the
buffer. For this we will require another variable that tracks at which
address the next character is in. This variable will need to be
initialized in GetStr (which will be done in version 2).\
 It is also vital that this routine be robust enough to handle an empty
buffer. It will do this through the carry flag: reset means a character
was returned, set means the buffer was empty.

    GetChar:
        PUSH  HL
        LD    HL, (buf_ptr)  ; buf_ptr is our pointer variable
        LD    A, (HL)
        OR    A
        SCF                 ; Set carry to indicate error status
        JR    Z, GetChar_Done

        INC   HL            ; Update buffer pointer
        LD    (buf_ptr), HL
        OR    A             ; Reset carry to indicate success status

    GetChar_Done:
        POP   HL
        RET
        

It would also be useful to have an inverse routine, one that "ungets"
characters from the buffer. We might use such a routine in a case like
inputting numbers digit-by-digit, and stopping input when the first
non-digit character is read. That character might be part of subsequent
data, and should be returned.\
 The unget routine has a very simple concept: since the characters are
always in the buffer, the buffer pointer only needs to be decremented.
There should also be a check to make sure we don't go past the start of
the buffer.

    Ungetc:
        PUSH  HL
        PUSH  DE
        LD    HL, (buf_ptr)
        LD    DE, buffer     ; See that the buffer pointer is not
        b_call(_CpHLDE)     ; at the start of the buffer
        SCF                 ; Set carry to indicate error status
        JR    Z, Ungetc_Done
        DEC   HL
        LD    (buf_ptr), HL
        OR    A             ; Reset carry to indicate success status

    Ungetc_Done:
        POP   DE
        POP   HL
        RET

Version 2 — Editing
-------------------

We now have the bare bones of a string input engine. It's time to go
back over GetStr and see what optimizations can be done and what
additions we might like to have. We know we have to initialize the
variable buf\_ptr, but while we're at it, let's add some kind of editing
capabilities.

We'll allow two ways to edit the inputted string:

Backspace
: Pressing the <kbd>DEL</kbd> key will backspace over the last character input.

Wipe
: Pressing the <kbd>CLEAR</kbd> key will wipe out every input character.

#### Optimizing

Looking at the routine as a whole, notice that nowhere is DE really
used. We will take advantage of this by tracking the buffer pointer with
DE. We can now use HL for general addressing.

#### Initialize buf\_ptr.

This variable has to be allocated and should be initialized at the start
of the program.

#### Backspacing

We will implement a backspace as follows:

-   Check that there is actually a character to delete. If there isn't,
    abort.
-   Decrement CurCol.
-   Display a space to erase the previous character. Use `PutMap` so
    that cursor position is not affected.
-   Decrement the buffer pointer.
-   Decrement the buffer counter.

#### Wiping

A wipeout will be done like this:

-   Check that there are characters to delete. If not, abort.
-   Put zero in CurCol.
-   Display a space for each character in the buffer.
-   Reset the buffer pointer.
-   Reset the buffer count.

There can be instances where the user's input spans several lines. In
this case, if more than fifteen characters are input, the cursor
position will be on a row other than the origin. We need to be able to
take care of this. The updated code looks like this:

    #define BUFSIZE  48
    buffer   .EQU TextShadow
    buf_ptr  .EQU buffer + BUFSIZE + 1
    GetStr:
        RES   AppTextSave, (IY + AppFlags)
        LD    DE, buffer       ; Init pointer    LD    (buf_ptr), DE
        XOR   A
        LD    B, A             ; Init character counter
        LD    (CurCol), A

    KeyLoop:
        b_call(_GetCSC)       ; Get a character.
        OR    A               ; If no character received, restart
        JR    Z, KeyLoop

        CP    skEnter         ; If [ENTER] pressed, exit
        JR    NZ, NotEnter

        XOR   A               ; Null-terminate buffer
        LD    (DE), A    RET

    NotEnter:
        CP    skDel           ; If [DEL] key pressed, backspace
        JR    NZ, NotDel

        LD    A, B             ; See that there is a character to delete
        OR    A
        JR    Z, KeyLoop       ; If not, restart

        LD    HL, CurCol       ; Save value of CurCol
        LD    A, (HL)
        DEC   (HL)            ; Decrement cursor column

        OR    A               ; If original column was zero, should back up one row
        JR    NZ, DidNotCrossLine
        LD    (HL), 15         ; Set cursor to last column
        DEC   HL              ; Go back one row
        DEC   (HL)

    DidNotCrossLine:
        DEC   DE              ; Backup one char in buffer
        DEC   B               ; Decrease char counter
        LD    A, ' '           ; Erase char on screen
        b_call(_PutMap)       ; without affecting position
        JR    KeyLoop
        
    NotDel:
        CP    skClear         ; If [CLEAR] pressed, everything must die!!!
        JR    NZ, NotClear

        LD    C, B             ; Divide characters input by 16
        SRA   C               ; to determine how many rows the input spans
        SRA   C
        SRA   C
        SRA   C

        LD    HL, CurRow
        LD    A, B             ; See if there are any characters to clear
        OR    A
        JR    Z, KeyLoop

        LD    A, (HL)          ; Backup to the start of input
        SUB   C
        LD    C, A
        LD    (HL), A

        INC   HL              ; Go to first column
        LD    (HL), 0
        LD    A, ' '
        
    ClearLoop:
        b_call(_PutC)         ; Draw spaces to clear everything
        DJNZ   ClearLoop      ; Will reset char counter

        LD    (HL), B          ; Reset column to zero
        DEC   HL              ; Reset row to original value
        LD    (HL), C
        LD    DE, buffer       ; Reset buffer pointer
        JR    KeyLoop

    NotClear:    LD    C, A             ; Save input char temporarily
        LD    A, B             ; See if at max characters input
        CP    BUFSIZE
        JR    Z, KeyLoop
        LD    A, C             ; Restore char

        SUB   skAdd           ; Throw out all keys below [+]
        JR    C, KeyLoop
        CP    skMath - skAdd + 1    ; Throw out all keys above [MATH]
        JR    NC, KeyLoop

        PUSH  DE              ; Convert scan code into character    LD    H, 0
        LD    L, A
        LD    DE, CharTable
        ADD   HL, DE
        LD    A, (HL)
        POP   DE
        b_call(_PutC)         ; Echo it

        LD    (DE), A          ; Write char to buffer
        INC   DE              ; Increment pointer    INC   B               ; Increment counter
        JR    KeyLoop

    CharTable:
    .DB  $27, "WRMH", $FF, $FF        ; + - × ÷ ^ undefined
    .DB  "?", $5B, "VQLG", $FF, $FF    ; (-) 3 6 9 ) TAN VARS undefined
    .DB  ":ZUPKFC", $FF             ; . 2 5 8 ( COS PRGM STAT
    .DB  " YTOJEB", $FF, $FF         ; 0 1 4 7 , SIN APPS XTθn undefined
    .DB  "XSNIDA"                  ; STO LN LOG x2 x-1 MATH

Version 3 — Shift Keys
----------------------

Our current input routine is somewhat limited in ability, it can only
deal with alphabetic characters. What we will now do is modify it so
that the user can toggle between alpha keys and normal keys.

How to do this? The simplest way is to have two lookup tables, one for
alpha, the other for normal. We will toggle between the two modes using
the <kbd>ALPHA</kbd> key, and store the current mode in the system flag
ShiftAlpha.

    #define BUFSIZE  48
    buffer   .EQU TextShadow
    buf_ptr  .EQU buffer + BUFSIZE + 1
    GetStr:
        RES   AppTextSave, (IY + AppFlags)
        RES   ShiftAlpha, (IY + ShiftFlags)    LD    DE, buffer       ; Init pointer
        LD    (buf_ptr), DE
        XOR   A
        LD    B, A             ; Init character counter
        LD    (CurCol), A

    KeyLoop:
        b_call(_GetCSC)       ; Get a character.
        OR    A               ; If no character received, restart
        JR    Z, KeyLoop

        CP    skEnter         ; If [ENTER] pressed, exit
        JR    NZ, NotEnter

        XOR   A               ; Null-terminate buffer
        LD    (DE), A
        RES   ShiftAlpha, (IY + ShiftFlags)    RET

    NotEnter:

        CP    skAlpha
        JR    NZ, NotAlpha

        LD    HL, Flags + ShiftFlags
        LD    A, (HL)
        XOR   1 << ShiftAlpha     ; Toggle state of ShiftAlpha flag
        LD    (HL), A
        JR    KeyLoop
        
    NotAlpha:    CP    skDel           ; If [DEL] key pressed, backspace
        JR    NZ, NotDel

        LD    A, B             ; See that there is a character to delete
        OR    A
        JR    Z, KeyLoop       ; If not, restart

        LD    HL, CurCol       ; Save value of CurCol
        LD    A, (HL)
        DEC   (HL)            ; Decrement cursor column

        OR    A               ; If original column was zero, should back up one row
        JR    NZ, DidNotCrossLine
        LD    (HL), 15         ; Set cursor to last column
        DEC   HL              ; Go back one row
        DEC   (HL)

    DidNotCrossLine:
        DEC   DE              ; Backup one char in buffer
        DEC   B               ; Decrease char counter
        LD    A, ' '           ; Erase char on screen
        b_call(_PutMap)       ; without affecting position
        JR    KeyLoop
        
    NotDel:
        CP    skClear         ; If [CLEAR] pressed, everything must die!!!
        JR    NZ, NotClear

        LD    C, B             ; Divide characters input by 16
        SRA   C               ; to determine how many rows the input spans
        SRA   C
        SRA   C
        SRA   C

        LD    HL, CurRow
        LD    A, B             ; See if there are any characters to clear
        OR    A
        JR    Z, KeyLoop

        LD    A, (HL)          ; Backup to the start of input
        SUB   C
        LD    C, A
        LD    (HL), A

        INC   HL              ; Go to first column
        LD    (HL), 0
        LD    A, ' '
        
    ClearLoop:
        b_call(_PutC)         ; Draw spaces to clear everything
        DJNZ   ClearLoop      ; Will reset char counter

        LD    (HL), B          ; Reset column to zero
        DEC   HL              ; Reset row to original value
        LD    (HL), C
        LD    DE, buffer       ; Reset buffer pointer
        JR    KeyLoop

    NotClear:
        LD    C, A             ; Save input char temporarily
        LD    A, B             ; See if at max characters input
        CP    BUFSIZE
        JR    Z, KeyLoop
        LD    A, C             ; Restore char

        SUB   skAdd           ; Throw out all keys below [+]
        JR    C, KeyLoop
        CP    skMath - skAdd + 1    ; Throw out all keys above [MATH]
        JR    NC, KeyLoop

        PUSH  DE              ; Convert scan code into character
        LD    DE, CharTable
        BIT   ShiftAlpha, (IY + ShiftFlags)
        JR    NZ, AlphaMode
        LD    DE, NormalTable

    AlphaMode:        LD    H, 0
        LD    L, A
        LD    DE, CharTable
        ADD   HL, DE
        LD    A, (HL)
        POP   DE
        b_call(_PutC)         ; Echo it

        LD    (DE), A          ; Write char to buffer
        INC   DE              ; Increment pointer    INC   B               ; Increment counter
        JR    KeyLoop

    CharTable:
    .DB  $27, "WRMH", $FF, $FF        ; + - × ÷ ^ undefined
    .DB  "?", $5B, "VQLG", $FF, $FF    ; (-) 3 6 9 ) TAN VARS undefined
    .DB  ":ZUPKFC", $FF             ; . 2 5 8 ( COS PRGM STAT
    .DB  " YTOJEB", $FF, $FF         ; 0 1 4 7 , SIN APPS XTθn undefined
    .DB  "XSNIDA"                  ; STO LN LOG x2 x-1 MATH

    NormTable:
    .DB  "+-*/^", $FF, $FF           ; + - × ÷ ^ CLEAR undefined
    .DB  "_369)", $C1, "]", $FF       ; (-) 3 6 9 ) TAN VARS undefined
    .DB  ".258({};"                ; . 2 5 8 ( COS PRGM STAT
    .DB  "0147, <>|", $FF            ; 0 1 4 7 , SIN APPS XTθn undefined
    .DB  $05, "!@#%&"               ; STO LN LOG x2 x-1 MATH

A Cursor
--------

A blinking cursor'll make our input engine look just extra tricked out.
All you need to know about the workings are:

-   The cursor will be shown if `CurOn, (IY + CurFlags)` is set.
-   The system interrupt uses the value of `(CurTime)` to blink the
    cursor. When this variable hits zero, the status of `CurOn` is flipped
    and `(CurTime)` is reset to `$32`.
-   Force the cursor off when <kbd>DEL</kbd> and <kbd>CLEAR</kbd> are pressed.
-   Force the cursor on when <kbd>ALPHA</kbd> or a valid key is pressed, and
    also after you have cleared a character or a line.

The included program [demo27.8xp]({{% resource "DEMO27.8XP" %}}) will show you more or less what you
should aim for.

Numerical Input
---------------

We can use GetStr to input numbers in addition to strings. To do this we
input the number as a string and process it depending on what kind of
number we are looking for. What follows are four routines that you can
use to convert an ASCII representation of a number to its binary
counterpart for decimal and hexadecimal. Each routine has an 8-bit
version and a 16-bit version.

As for the details on each routine,

-   The 8-bit ones output their result to C and the 16-bit ones output
    to HL.
-   An error occurs if an invalid bit, digit, or hexit is encountered.
-   The error status is reported in the carry flag. Set means an error
    occured.
-   Conversion is finished upon encountering a space or when the buffer
    is exhausted.
-   For decimal, only the first digits without overflow are used. E.g.
    "70000" results in 7000 for 16-bit and 70 for 8-bit. The trailing
    zeros are left in the buffer.
-   For hexadecimal, only the last digits entered are used. E.g.
    "4C3A024" results in \$A024 for 16-bit and \$24 for 8-bit. The
    preceding characters are lost.

### ASCII-Encoded Decimal to Register C

    .module    ConvDec8
    ConvDec8:
        LD    C, 0

    _Loop:
        CALL  GetChar
        CCF             ; End if no more characters
        RET   NC

        SUB   '0'       ; Throw out all characters below '0'
        JR    C, _Check

        CP    10        ; Throw out all characters above '9'
        CCF
        RET   C

        LD    D, A       ; Save value in D
        LD    A, C       ; Load running total
        CP    26        ; Halt if there would be an overflow (260+)
        JP    NC, Ungetc ; Return gotten character

        LD    E, C       ; Save current number in case of overflow
        ADD   A, A       ; Multiply by 10
        ADD   A, A
        ADD   A, C
        ADD   A, A
        ADD   A, D       ; Add gotten character

        LD    C, A       ; Halt if overflow (256 to 259)
        JR    NC, _Loop

        LD    C, E
        JP    Ungetc

    _Check:
        CP    ' ' - '0' ; If a space is encountered exit without error
        RET   Z
        SCF
        RET

### ASCII-Encoded Hexadecimal to Register C

    .module    ConvHex8
    ConvHex8:
        LD   BC, 0

    _Loop:
        CALL  GetChar
        JR    C, _Check

        CP   ' '
        JR    Z, _Check

        SUB   '0'
        RET   C

        CP    10
        JR    C, _Okay         ; Not a hexit in the range A-F

        CP    'F' - '0' + 1   ; Throw out all characters above 'F'
        CCF
        RET   C

        CP    'A' - '0'       ; Throw out all characters between '9' and 'A'
        RET   C
        SUB   7               ; Make A-F into 10-15

    _Okay:
        PUSH  AF
        LD    A, C             ; Multiply running total by 16
        ADD   A, A
        ADD   A, A
        ADD   A, A
        ADD   A, A
        OR    C               ; Add in character
        LD    C, A
        INC   B
        JR    _Loop

    _Check:
        LD    A, B
        OR    A
        RET   NZ
        SCF
        RET

### ASCII-Encoded Decimal to Register HL

    .module    ConvDec16
    ConvDec16:
        LD    HL, 0
        LD    B, H

    _Loop:
        CALL  GetChar
        CCF
        RET   NC

        SUB   '0'
        JR    C, _Check

        CP    10
        CCF
        RET   C

        LD    D, H
        LD    E, L
        ADD   HL, HL
        ADD   HL, HL
        ADD   HL, DE
        ADD   HL, HL
        JR    C, _Overflow

        LD    C, A
        ADD   HL, BC
        JR    NC, _Loop

    _Overflow:
        EX    DE, HL
        JR    Ungetc
        
    _Check:
        CP    ' ' - '0'
        RET   Z
        SCF
        RET

### ASCII-Encoded Hexadecimal to Register HL

    .module    ConvHex16
    ConvHex16:
        LD    HL, 0
        LD    C, H

    _Loop:
        CALL  GetChar
        JR    C, _Check

        CP    ' '
        JR    Z, _Check

        SUB   '0'
        RET   C

        CP    10
        JR    C, _Okay

        CP    'F' - '0' + 1
        CCF
        RET   C

        CP    'A' - '0'
        RET   C
        SUB   7

    _Okay:
        ADD   HL, HL
        ADD   HL, HL
        ADD   HL, HL
        ADD   HL, HL
        OR    L
        LD    L, A
        INC   C
        JR    _Loop

    _Check:
        LD    A, C
        SCF
        RET
