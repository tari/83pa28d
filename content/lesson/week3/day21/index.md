---
title: "Day 21: The VAT"
---

About The VAT
-------------

VAT is an acronym for Variable Allocation Table. What it actually is is
a large chunk of RAM holding the attributes of every variable on the
calculator. The VAT's size is constantly in flux: when you create a
variable, the VAT's size is instantly increased to accomodate the new
entry. When variables are deleted, the VAT shrinks as the entries for
those variables are removed.

![]({{% resource "vat.png" %}})

The VAT starts immediately before the end of the hardware stack and is
divided into two parts. The first part holds the names of real, complex,
matrix, picture, GDB, and equation type variables. This region starts
immediately after the Hardware Stack at the fixed address SymTable.\
 The second part holds programs, lists, groups, and AppVars. The
beginning is stored in the variable `(ProgPtr)` and ends at `(PTemp)+1`.

Structure Of VAT Entries
------------------------

Each VAT entry is a structure of several elements, but there is a twist:
the entries are written backwards!

### Program, AppVar, and Group

<table>
 <tr>
  <th>-14</th> <th>-13</th> <th>-12</th>
  <th>-11</th> <th>-10</th> <th>-9</th>
  <th>-8</th> <th>-7</th> <th>-6</th>
  <th>-5</th> <th>-4</th> <th>-3</th>
  <th>-2</th> <th>-1</th> <th>0</th>
 </tr>
 <tr>
  <td colspan="8">Variable name - Eight tokens maximum</td>
  <td>NL</td>
  <td>Page</td>
  <td>DAH</td>
  <td>DAL</td>
  <td>Ver</td>
  <td>T2</td>
  <td>T</td>
 </tr>
</table>

### List

<table>
 <tr>
  <th>-13</th> <th>-12</th>
  <th>-11</th> <th>-10</th> <th>-9</th>
  <th>-8</th> <th>-7</th> <th>-6</th>
  <th>-5</th> <th>-4</th> <th>-3</th>
  <th>-2</th> <th>-1</th> <th>0</th>
 </tr>
 <tr>
  <td colspan="5">List name - 5 tokens max</td>
  <td>tVarLst</td>
  <td>NL</td>
  <td>Page</td>
  <td>DAH</td>
  <td>DAL</td>
  <td>Ver</td>
  <td>T2</td>
  <td>T</td>
 </tr>
</table>

### Real, Complex, Matrix, Equation, GDB, and Picture

| -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 |
|----|----|----|----|----|----|----|----|---|
| \$00 | Second name token | First name token | Page | DAH | DAL | Ver | T2 | T |

Key:

T
:    The object type and system effects:

     0-4
     :    Object type

     5
     :    If a graph equation, then it's active if set.

     6
     :    Variable is used during graphing if set.

     7
     :    Variable is designated for link transfer if set.

T2
:    Reserved for future use

Ver
:    Version number. If a future TI-83 Plus version introduces a new variable
     format, this is used to prevent sending that variable to an older version.

DAL, DAH
:    Pointer to the data. DAL is the least-significant byte, and DAH is the
     most-significant.

Page
:    The ROM page the variable is archived on. If the variable is in RAM, then 0.

NL
:    The length of the name. For lists, `tVarLst` is included in the value.

F\#
:    Number of a formula attached to a list, or 0 if no formula.

The structure of a list formula is

| -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 |
|----|----|----|----|----|----|----|----|---|
| \$00 | F\# | \$3F | Page | DAH | DAL | Ver | T2 | EquObj

Searching The VAT
-----------------

To scan the VAT, step through each entry from SymTable to `(PTemp)+1`
with HL or IX linearly.

### Program 20-1

Search for and display all programs. Try modifying it to account for
archived programs.

        RES    AppTextSave, (IY + AppFlags)
        b_call(_ClrLCDFull)
        LD     HL, (ProgPtr)    ; Start of Symbol Table for programs

    MainLoop:
        LD     DE, 0
        LD     (CurRow), DE
        LD     C, 7             ; Counter. We can display 7 variables per screen
    FindLoop:
        LD     DE, (PTemp)      ; Check to see if we're at the end of the symbol table
        OR     A
        SBC    HL, DE
        JR     Z, Done
        JR     C, Done
        ADD    HL, DE           ; Restore HL

        LD     A, (HL)          ; Check the [T] of entry, take appropriate action
        AND    $1F             ; Bitmask off bits 7-5 to get type only.
        CP     ProgObj
        JR     Z, IsNormalProg
        CP     ProtProgObj
        JR     NZ, Skip

        LD     A, '#'           ; We'll use a hash to signify a protected program...
        JR     DispStatus

    IsNormalProg:
        LD     A, ' '           ; ...or space padding for a normal program

    DispStatus:
        b_call(_PutC)          ; Display protection status

        ; At this point, HL -> [T], so we'll move back six bytes to [NL]
        LD     DE, -6
        ADD    HL, DE
        LD     B, (HL)          ; Store number of characters in name for DJNZ

    DispNameLoop:
        DEC    HL
        LD     A, (HL)
        b_call(_PutC)
        DJNZ   DispNameLoop

        DEC    HL              ; Move back one byte so HL -> [T] of next entry

        b_call(_NewLine)

        DEC    C               ; Subtract counter
        JR     NZ, FindLoop

        PUSH   HL
        b_call(_GetKey)        ; Press any key...
        b_call(_ClrLCDFull)
        POP    HL

        JR     MainLoop

    Skip:
        ; Skip an entry
        OR     A
        LD     DE, 6
        SBC    HL, DE
        LD     E, (HL)         ; Put name length in E to skip
        INC    E              ; Add 1 to go to [T] of next entry
        SBC    HL, DE
        JR     FindLoop

    Done:
        b_call(_GetKey)
        SET    AppTextSave, (IY + AppFlags)
        RET                   ; That's all folks!

