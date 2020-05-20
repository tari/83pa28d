---
tocpath: ../
title: Day 16
subtitle: Character Strings
prev-lesson: day15
next-lesson: day17
difficulty: 3
---


Strings
-------

An amazingly common programming task is doing various operations on
strings. This chapter looks at character strings, collections of ASCII
characters stored in contiguous memory locations and taken as one
entity. But the interesting thing is that you could consider all data
structures stored contiguously, like arrays, pictures, multibyte
integers, etc. as kinds of strings. And the techniques you will soon
learn apply almost equally to each.

String Types
------------

I said "characters stored in contiguous memory locations" — almost
sounds like the definition of an array of characters. That's quite true,
but technically a character array is not a string because arrays have a
fixed size. Real strings are able to change their length at runtime (up
to a limit, of course).\
 Since these variable-length strings can contain any number of bytes,
it's length must be recorded somehow. There are numerous ways to do
this, but the two most popular are LBPS (length-byte prefixed strings)
and NBTS (null-byte terminated strings). NBTS you have seen before, you
follow the string by the value zero:

        .DB    "Hello", 0

LBPS precedes the string with the number of characters.

        .DB    5, "Hello"

While both methods have their advantages over the other, the
length-prefixing method is much better than null-termination. One major
point in its favor is that almost every string function needs the length
of the string (actually it would be more truthful to say that they
become easier to write). For LBPS this is nothing, you just fetch the
first byte. With NTBS you have to scan the entire string looking for
zero, keeping track of the number of characters processed. This takes
considerably more time and processing power. Aside from this, NTBS can't
contain the null-character (which admittedly is not all that big of a
deal).

To be fair, LBPS can't be more than 255 characters in size unless you
use two bytes for the index. Although, you'll rarely have a need for
strings larger than 255 bytes. Another good side of NTBS is that they're
easy to declare, since all you have to do is add a zero. It can be
tedious to count all the characters, and in a long string you could
mis-count, and that's never fantastic.

String Instructions
-------------------

With so many string operations, it's a shame that the Z80 is almost
bereft of string instructions. In fact, there are only two string
primitive instructions, and four variations.

`LDI`
:    Loads value stored at `(HL)` into `(DE)`. Then, `HL` and `DE` are
     incremented, and `BC` is decremented.
     
     S
     :     not affected
     Z
     :     not affected
     P/V
     :     reset if `BC` becomes zero, set otherwise
     C
     :     not affected

`CPI`
:    Compares the accumulator with the value stored at `(HL)`. Then, `HL` is
     incremented, and `BC` is decremented.
     
     S
     :     affected by `A` - `(HL)`
     Z
     :     affected by `A` - `(HL)`
     P/V
     :     reset if `BC` becomes zero, set otherwise
     C
     :     not affected

These two instructions have a version that works in the opposite
direction:

`LDD`
:    Loads value stored at `(HL)` into `(DE)`. Then, `HL`, `DE`, and `BC` are
     decremented.
     
     S
     :    not affected
     Z
     :    not affected
     P/V
     :    reset if `BC` becomes zero, set otherwise
     C
     :    not affected

`CPD`
:    Compares the accumulator with the value stored at `(HL)`. Then, `HL` and
     `BC` are decremented.
     
     S
     :    affected by `A` - `(HL)`
     Z
     :    affected by `A` - `(HL)`
     P/V
     :    reset if `BC` becomes zero, set otherwise
     C
     :    not affected

And rouding out the family, each of those four has a version that
automatically repeats itself.

`LDIR`
:     Loads value stored at `(HL)` into `(DE)`. Then, `HL` and `DE` are
      incremented, and `BC` is decremented. This process continues until `BC`
      = 0.
      
      S
      :    not affected
      Z
      :    not affected
      P/V
      :    reset
      C
      :    not affected

`LDDR`
:     Loads value stored at `(HL)` into `(DE)`. Then, `HL`, `DE`, and `BC` are
      decremented. This process continues until `BC` = 0.
      
      S
      :    not affected
      Z
      :    not affected
      P/V
      :    reset
      C
      :    not affected

`CPIR`
:     Compares the accumulator with the value stored at `(HL)`. Then, `HL` is
      incremented, and `BC` is decremented. This process continues until `BC`
      = 0, or the zero flag is set (`A` = `(HL)`).
      
      S
      :    affected by final `A` - `(HL)`
      Z
      :    affected by final `A` - `(HL)`
      P/V
      :    reset if `BC` becomes zero, set otherwise
      C
      :    not affected

`CPDR`
:     Compares the accumulator with the value stored at `(HL)`. Then, `HL` and
      `BC` are decremented. This process continues until either `BC` = 0, or
      the zero flag is set (`A` = `(HL)`).
      S
      :    affected by final `A` - `(HL)`
      Z
      :    affected by final `A` - `(HL)`
      P/V
      :    reset if `BC` becomes zero, set otherwise
      C
      :    not affected

Now you know the only string operations directly supported by the
instruction set. How you use them, that's the topic of the rest of this
chapter.

Moving Strings
--------------

To move a string from one place to another, you need only LDIR or LDDR.\
 Let's move 2000 bytes of data from address `$8000` to address `$D000`.

                    LD     HL, $8000                LD     HL, $8000+1999
                    LD     DE, $D000                LD     DE, $D000+1999
                    LD     BC, 2000                 LD     BC, 2000
                    LDIR                           LDDR

The main reason there is an instruction for both directions is for when
the source and destination blocks overlap.\
 If we tried to copy 1000 bytes from `$1000` to `$1005` with LDIR:

        LD     HL, $1000
        LD     DE, $1005
        LD     BC, 1000
        LDIR

If we could look at memory as LDIR is processing, it would look like
this:

Address

| Pass\\Address | \$1000 | \$1001 | \$1002 | \$1003 | \$1004 | \$1005 | \$1006 | \$1007 | \$1008 |
|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
| Start | C7 | A1 | D1 | 37 | 66 | 2B | 0C | 30 | 1D |
| 1 | *C7* | A1 | D1 | 37 | 66 | *C7* | 0C | 30 | 1D |
| 2 | C7 | *A1* | D1 | 37 | 66 | C7 | *A1* | 30 | 1D |
| 3 | C7 | A1 | *D1* | 37 | 66 | C7 | A1 | *D1* | 1D |

You should be able to see that the data from \$1005 onwards is being
corrupted. The end result is the bytes \$1000 to \$13EC holding the
pattern C7A1D13766 C7A1D13766..... In order to do this properly, we've
got to use LDDR and do the copying at the other end:

        LD     HL, $13E7
        LD     DE, $13EC
        LD     BC, 1000
        LDIR

| Pass\\Address | \$13E4 | \$13E5 | \$13E6 | \$13E7 | \$13E8 | \$13E9 | \$13EA | \$13EB | \$13EC |
|---------------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
| Start | 12 | EF | 3A | 4C | ?? | ?? | ?? | ?? | ?? |
| 1 | 12 | EF | 3A | *4C* | ?? | ?? | ?? | ?? | *4C* |
| 2 | 12 | EF | *3A* | 4C | ?? | ?? | ?? | *3A* | 4C |
| 3 | 12 | *EF* | 3A | 4C | ?? | ?? | *EF* | 3A | 4C |

Eventually, the original data will again get corrupted, but it doesn't
matter 'cuz it's already been copied over. Likewise, if the destination
address is greater than the source address, you use LDIR as normal.

On the other hand, the "wrong" method can be used to load a value to
every byte in a string. Here we're zeroing every byte of
AppBackupScreen.

        LD     HL, AppBackupScreen
        LD     DE, AppBackupScreen+1
        LD     BC, 768        ; 768 bytes in AppBackupScreen
        LD     (HL), 0        ; Set first byte to zero
        LDIR
        RET

This can be modified to create a string of any repeating pattern. Even
though SP can do that three times as fast, only LDIR can be used for a
string with an odd number of elements. LDIR is also a little "cleaner".

Exchanging Strings
------------------

If you want to exchange two strings of the same size, all you need is
LDI and a little thought:

    ;Exchange length-prefixed string at $6000 with string at $8000
        LD     DE, $6001        ; Skip length byte
        LD     HL, $8000
        LD     B, 0
        LD     C, (HL)
        INC    HL              ; Skip length byte
    XchgLoop:
        LD     A, (DE)          ; Preserve (DE)
        LDI                    ; (HL) -> (DE)
        DEC    HL              ; Move HL back
        LD     (HL), A          ; Complete the exchange
        INC    HL              ; Restore HL for next LDI
        JP     PE, XchgLoop     ; If LDI set P/V, continue

String Length
-------------

With a length-prefixed string, finding the length is trivial. For a
null-terminated string, the process is decidedly more involved. This is
where CPIR comes in.

    ; Get the length of the null-terminated string starting at $8000
        LD     HL, $8000
        XOR    A               ; Zero is the value we are looking for.
        LD     B, A             ; Since we haven't the slightest clue as to the 
        LD     C, A             ; actual size of the string, put 0 in BC to search
                               ; 65, 536 bytes (the entire addressable memory space).
        CPIR                   ; Begin search for a byte equalling zero.

    ; BC has been decremented so that it holds -length. Now need to synthesize a NEG BC.
        LD     H, A             ; Zero HL (basically set it to 65, 536) to get the
        LD     L, A             ; number of bytes
        SBC    HL, BC           ; Find the size. CPIR doesn't affect carry.
        DEC    HL              ; Compensate for null.

Converting String Types
-----------------------

Sometimes, you might want to convert a null-terminated string to a
length-prefixed string, or vice versa. Here is how to convert NTBS to
LBPS. The inverse operation is almost identical.

    ; INPUT    HL = Address of null-terminated string
    ; OUTPUT   HL = Address of place to put length-prefixed string

        PUSH   HL              ; Source is needed later.
        XOR    A               ; Length-determining code from previous section.
        LD     B, A
        LD     C, A
        CPIR
        LD     H, A
        LD     L, A
        SBC    HL, BC

        LD     A, L             ; We will assume that the string is no bigger than 255 bytes.
        LD     B, H             ; Put size in BC.
        LD     C, L
        POP    HL              ; Restore HL.
        ADD    HL, BC           ; Point HL at the end of the string.
        LD     D, H             ; Point DE at the end of the string.
        LD     E, L
        DEC    HL              ; Move HL back one byte.
        LDDR                   ; Move every character forward one byte.
        LD     (DE), A          ; Put length in.

Comparing Strings
-----------------

    ;IN    HL     Address of string1.
    ;      DE     Address of string2.
    ;OUT   zero   Set if string1 = string2, reset if string1 != string2.
    ;      carry  Set if string1 > string2, reset if string1 <= string2.

    CmpStrings:
        PUSH   HL
        PUSH   DE

        LD     A, (DE)          ; Compare lengths to determine smaller string
        CP     (HL)            ; (want to minimize work).
        JR     C, Str1IsBigger
        LD     A, (HL)

    Str1IsBigger:
        LD     C, A             ; Put length in BC
        LD     B, 0
        INC    DE              ; Increment pointers to meat of string.
        INC    HL

    CmpLoop:
        LD     A, (DE)          ; Compare bytes.
        CPI
        JR     NZ, NoMatch      ; If (HL) != (DE), abort.
        INC    DE              ; Update pointer.
        JP     PE, CmpLoop

        POP    DE
        POP    HL
        LD     A, (DE)          ; Check string lengths to see if really equal.
        CP     (HL)
        RET

    NoMatch:
        DEC    HL
        CP     (HL)            ; Compare again to affect carry.
        POP    DE
        POP    HL
        RET

Other String Functions
----------------------

Okay, so here is how to implement the most common string functions in
assembly:

<div class="no-pop">
[Substring](#substring)
:    Copies part of one string into another.
[Index](#index)
:    Finds the offset of the first occurence of one string in another.
[Insert](#insert)
:    Inserts one string into another.
[Delete](#delete)
:    Removes characters from a string.
[Concatenate](#concatenate)
:    Joins two strings.
</div>

Other functions, like reversing, converting to upper or lowercase, and
creating a string composed of entirely the same character are too simple
to go into detail here. You should be able to write them with both hands
tied behind your back (provided you're proficient in nose-typing :-).

If you want to have a crack at making any of these routines yourself,
you should skip the remainder of this day, because that's all there is
left. If you don't think you can cut it, or you want to check what you
came up with, then follow along.

### Substring

    ;IN   HL   Address of source string, length-prefixed.
    ;     DE   Address of destination string, length-prefixed.
    ;     B    Start index. 1 = first character.
    ;     C    Length of substring to return.
    ;
    ;OUT  carry    Set if an error condition happened:
    ;                If B is zero, then uses index of 1.
    ;                If index > source length, an empty string is returned.
    ;                If index + return length > source length, returns all
    ;                characters from index to end-of-string.
        
        PUSH   DE        ; It would be convenient to keep DE pointing to
                         ; the start of the destination string
        OR     A         ; Boolean OR resets carry
        PUSH   AF        ; Save carry
        LD     A, B       ; Is index beyond source length?
        CP     (HL)
        DEC    A         ; Decrement A so NC can be used
        JR     NC, ReturnEmpty

        ADD    A, C       ; If index+len is > 255, error
        JR     C, TooLong
        INC    A         ; Increment A so C can be used
        CP     (HL)      ; If index+len is beyond source length, then error
        JR     C, OkaySoFar

    TooLong:
        POP    AF        ; Set carry flag
        SCF
        PUSH   AF
        LD     A, (HL)    ; Get source length
        SUB    B         ; Subtract start index
        INC    A         ; Compensate
        LD     C, A       ; New size of string

    OkaySoFar:
        LD     A, C       ; Size of sting to get
        LD     (DE), A    ; Save length index
        INC    DE        ; To body of string
        LD     A, B       ; Get index
        LD     B, 0       ; Zero-extend BC for LDIR

        ADD    A, L       ; This is a sneaky way to add A to HL
        LD     L, A       ; without using up another 16-bit register
        ADC    A, H       ;
        SUB    L         ;
        LD     H, A       ;

        LDIR             ; Copy substring over
        POP    AF        ; Restore flags
        POP    DE        ; Restore destination
        RET

    ReturnEmpty:
        XOR    A         ; Set a length index of zero
        LD     (DE), A
        POP    AF        ; Clean off stack and set carry
        POP    DE
        SCF
        RET

### Index

    ;IN  HL       Address of string to look in, length prefixed.
    ;    DE       Address of string to find, length prefixed.
    ;
    ;OUT
    ; If found:
    ;    A        Offset into look-up string where the target string was found.
    ;             The first byte (ignoring length prefix) is offset 1.
    ;    carry    Reset.
    ;
    ; If not found:
    ;    A    = 0
    ;    carry    Set.

        LD     A, (DE)    ; Abort if string to find is too big
        CP     (HL)
        INC    A
        JR     NC, Abort

        DEC    A         ; Save length of string to find
        LD     IXL, A

        LD     B, 0       ; Put length of string to search in BC
        LD     C, (HL)

        INC    HL        ; Advance pointers
        INC    DE
        PUSH   HL        ; Save start of search string

    Restart:
        PUSH   DE        ; Save start of key string

        LD     A, IXL     ; Initialize matched characters counter
        LD     IXH, A

        LD     A, (DE)    ; Get a character to match
        CPIR             ; Look for it
        JR     NZ, NotFound    ; Abort if not found

    Loop:
        DEC    IXH       ; Update counter and see if done
        JR     Z, Found

        INC    DE        ; Get next character in key string
        LD     A, (DE) 
        CPI              ; See if it matches next char in master
        JR     Z, Loop
        JP     PO, NotFound    ; Abort if we ran out of characters

        POP    DE        ; If a mismatch, restart from the beginning
        JR     Restart

    NotFound:
        POP    DE        ; Clean stack
        POP    HL

    Abort:
        XOR    A         ; Report failure
        SCF
        RET

    Found:
        POP    DE
        POP    BC        ; BC = address of master

        XOR    A         ; Put size of key string in DE
        LD     D, A
        LD     E, IXL

        SBC    HL, DE     ; Find index
        SBC    HL, BC    
        LD     A, L
        INC    A
        RET

### Insert

    ; IN   HL      Address of string to be inserted
    ;      DE      Address of string to receive insertion
    ;      C       Index. Start of string is 0
    ; OUT
    ;  If successful:
    ;      carry   Reset
    ;      HL      Input DE
    ;  If unsuccessful:
    ;      carry   Set. If new string length is > 255.
    ;
    ; Notes        If index > string length, string is appended.
    ;              Data after the string is destroyed.

        LD     A, (DE)    
        LD     B, A

        INC    A
        CP     C
        JR     NC, IndexIsOkay
        LD     C, B

    IndexIsOkay:
        DEC    A
        ADD    A, (HL)
        RET    C
        LD     (DE), A    ; Update length

        PUSH   DE        ; Make room
        PUSH   HL
        LD     A, (HL)
        INC    C

        LD     H, 0
        LD     L, C
        ADD    HL, DE

        LD     D, H
        LD     E, L
        PUSH   AF
        ADD    A, E
        LD     E, A
        ADC    A, D
        SUB    E
        LD     D, A
        POP    AF

        LD     B, 0
        LD     C, A
        PUSH   HL
        LDIR

        POP    DE        ; Copy string over
        POP    HL
        LD     C, (HL)
        INC    HL
        LDIR
        POP    HL
        RET

### Delete

    ; IN  HL       Address of string.
    ;     B        Index of first character to delete. First character is 0.
    ;     C        Number of characters to kill.
    ; OUT
    ;  If successful:
    ;     carry    Reset
    ;  If unsuccessful:
    ;     carry    Set
    ;
    ; Notes        If B > string length, then error.
    ;              If B + C > string length, deletion
    ;              stops at end of string.

        LD     A, B       ; See if index is too big
        CP     (HL)
        CCF              ; Flip for error
        RET    C

        ADD    A, C       ; See if too many chars on chopping block
        CP     (HL)
        JR     C, IndexIsOkay

        INC    B         ; Set index as length
        LD     (HL), B
        RET

    IndexIsOkay:
        PUSH   HL
        LD     A, (HL)
        SUB    C
        LD     (HL), A
        INC    HL
     
        LD     E, C
        LD     C, B
        LD     B, 0
        ADD    HL, BC

        SUB    C
        LD     C, E
        LD     D, H
        LD     E, L
        ADD    HL, BC
        LD     C, A
        LDIR

        POP    HL
        RET

### Concatenate

    ; IN    HL       Address of first string.
    ;       DE       Address of second string.
    ; OUT
    ;  If successful:
    ;       carry    Reset
    ;  If unsuccessful:
    ;       carry    Set
    ;
    ; Notes        If new string lenght is > 255, error.
    ;        HL is saved.

        LD     A, (DE)     ; Combine lengths
        ADD    A, (HL)
        RET    C
        LD     C, (HL)
        LD     (HL), A

        LD     B, 0
        INC    C
        PUSH   HL
        ADD    HL, BC
        EX     DE, HL
        LD     C, (HL)
        INC    HL
        LDIR

        POP    HL
        RET

