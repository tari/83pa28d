---
tocpath: ../
title: Day 19
subtitle: User Variables
prev-lesson: day18
next-lesson: day20
difficulty: 3
---

User variables are all those variables that you can create and delete.
There are the real/complex variables A-Z, θ; lists, matrices, programs,
etc.

Variable Names
--------------

Each variable has its own unique name. Variable names are built to be
stored in the OP registers, so they can be at most nine bytes long.
While each variable type has its own naming conventions, the general
form is this:

<table><tr><th>OP1</th><th>+1</th><th>+2</th><th>+3</th><th>+4</th><th>+5</th><th>+6</th><th>+7</th><th>+8</th></tr>
<tr><td>**TYPE**</td><td colspan="8">*Variable name*</td></tr></table>

**TYPE** is a number specifying the object type. Each variable type has
a unique number. Object types not listed are undefined or for internal
useage only.

| Value | Equate | Variable Type |
|-------|--------|---------------|
|\$00 | RealObj | Real number |
|\$01 | ListObj | List |
|\$02 | MatObj  | Matrix |
|\$03 | EquObj  | Equation |
|\$04 | StrngObj | String |
|\$05 | ProgObj | Program |
|\$06 | ProtProgObj | Protected program <br/>(Hidden from EDIT menu) |
|\$07 | PictObj | Picture |
|\$08 | GDBObj | Graph Database |
|\$0B | NewEquObj | New Equation |
|\$0C | CplxObj | Complex number |
|\$0D | CListObj | Complex list |
|\$15 | AppVarObj | AppVar |
|\$16 | TempProgObj | Temporary program |

The rest is the name, spelled with tokens.

Tokens
------

A token is a code that represents system commands, variables, etc. We
use tokens to save space. For example, the command `Disp ` is four
letters and a space. This would normally be five bytes if stored as
individual characters. By using a token, we save four bytes (which is a
lot on a 64K machine). There are way too many tokens to list here; you
can find them in the TI83PLUS.INC file (hint: they all begin with
'`t`').

### Two-Byte Tokens

There is no way in hell we could assign a one-byte token to every single
command, so some tokens are defined with two bytes. Their format is
*token\_class*, *token*. The token class is the type of token wanted.

| Token Value | Class |
|-------------|-------|
| `tVarStrng` | String variables |
| `tVarMat` | Matrix variables |
| `tVarLst` | List variables |
| `tVarEqu` | Equation variables |
| `tVarPict` | Picture variables |
| `tVarGDB` | Graph database variables |
| `tVarOut` | Output-only variables |
| `tVarSys` | System IO variables |
| `t2ByteTok` | Extra general tokens |

Anyway, the .INC file has all the token descriptions with ample
comments. Just search for "2nd byte of".

Variable Name Formats
---------------------

### Real/Complex Numbers

Spelled with object type (RealObj or CplxObj) followed by one token (tA
to tZ and tTheta), and two nulls.

| OP1 | +1 | +2 | +3 | +4 | +5 | +6 | +7 | +8 |  |
|-----|----|----|----|----|----|----|----|----|--|
| `RealObj` | `tX` | `t00` | `$00` | ?? | ?? | ?? | ?? | ?? | Real variable `X` |
| `CplxObj` | `tTheta` | `$00` | `$00` | ?? | ?? | ?? | ?? | ?? | Complex variable θ |

### Lists

Spelled with object type (ListObj or CListObj), followed by token
tVarLst, and either:

-   A list name token and a null. *or*
-   Up to five tokens and a null.

| OP1 | +1 | +2 | +3 | +4 | +5 | +6 | +7 | +8 |    |
|-----|----|----|----|----|----|----|----|----|----|
| `ListObj` | `tVarLst` | `tL1` | `$00` | ?? | ?? | ?? | ?? | ?? | List `L`1 |
| `CListObj` | `tVarLst` | `tD` | `tI` | `tS` | `tT` | `$00` | ?? | ?? | Complex list L`DIST` |

### Matrices, Pictures, Strings

Spelled with appropriate object type (MatObj, PictObj, StrngObj),
followed by corresponding token tVarMat, tVarPict, or tVarStrng,
appropriate name token (tMatA to tMatJ, tPic0 to tPic9, tStr0 to tStr9),
and a null.

| OP1 | +1 | +2 | +3 | +4 | +5 | +6 | +7 | +8 |    |
|---|----|----|----|----|----|----|----|----|----|
| `MatObj` | `tVarMat` | `tMatC` | `$00` | ?? | ?? | ?? | ?? | ?? | Matrix `[C]` |
| `PictObj` | `tVarPict` | `tPic5` | `$00` | ?? | ?? | ?? | ?? | ?? | Picture `Pic5` |
| `StrngObj` | `tVarStrng` | `tStr1` | `$00` | ?? | ?? | ?? | ?? | ?? | String `Str1` |

### Equation

An object type of EquObj or NewEquObj (no, I can't tell you the
difference). Followed by token tVarEqu, one of the equation variable
names from the below table, and a null.

<div class="no-pop">
`tY0` to `tY9`
:    Function equations Y0 to Y9
`tX1T` to `tX6T`
:    Parametric equations X1T to X6T
`tY1T` to `tY6T`
:    Parametric equations Y1T to Y6T
`tR1` to `tR6`
:    Polar equations r1 to r6
`tun`
:    Sequence u(n)
`tvn`
:    Sequence v(n)
`twn`
:    Sequence w(n)
</div>

| OP1 | +1 | +2 | +3 | +4 | +5 | +6 | +7 | +8 |    |
|-----|----|----|----|----|----|----|----|----|----|
| `EquObj` | `tVarEqu` | `tY1` | `$00` | ?? | ?? | ?? | ?? | ?? | Equation `Y1` |

### Programs/AppVars

Spelled with object type (tProgObj, tProtProgObj, or tAppVarObj),
followed by up to eight tokens. If less than eight, then followed by a
null.

| OP1 | +1 | +2 | +3 | +4 | +5 | +6 | +7 | +8 |    |
|-----|----|----|----|----|----|----|----|----|----|
| `ProgObj` | `tP` | `tR` | `tO` | `tG` | `tR` | `tA` | `tM` | `t1` |  Program `PROGRAM1`|
| `ProtProgObj` | `tN` | `tO` | `tE` | `tD` | `tI` | `tT` | `$00` | ?? |  Protected program `NOEDIT`|
| `AppVarObj` | `tL` | `tA` | `tS` | `tT` | `tU` | `tS` | `tE` | `tR` |  AppVar `LASTUSER`|

Creating Variables
------------------

Now we'll actually create variables. There are some rules to follow to
prevent problems.

-   Check if the variable already exists. If it does, either delete it
    or abort creation.\
    Equations always exist, so there's no point in looking them up. Just
    delete and recreate them.
-   Don't create variables with illegal sizes.
-   Store data to the variable before the program ends, or the
    calculator will freeze.

To check if a variable exists:

`_FindSym`
:    Finds variables that aren't programs, AppVars, or groups.
          
     <div data-title="inputs">
     OP1
     :    Variable name. Not necessary to have the object type set.
     </div>
     
     <div data-title="outputs">
     F
     :    Carry set if not found, reset if exists.
     A
     :    Object type. Bits 5-7 are basically garbage, so if you want to use it,
          do `AND $1F`.
     B
     :    Archive status. 0 if in RAM
     DE
     :    Address of first byte of data
     HL
     :    Address of symbol table entry
     </div>
     
     <div data-title="destroys">
     If variable is found, then C. If variable is not found, then all.
     </div>

or

`_ChkFindSym     `
:    Finds any variable.
     
     <div data-title="inputs">
     OP1
     :    Variable name.
     </div>
     
     <div data-title="outputs">
     See `_FindSym`
     </div>
     
To delete a variable
     
`_DelVar     `
:    Deletes a variable if it's in RAM.
     
     <div data-title="inputs">
     HL
     :    Pointer to start of symbol table entry.     
     DE
     :    Pointer to start of variable's data storage.
     B
     :    0 if variable resides in RAM. Otherwise the Flash ROM page it is
          archived on.
     </div>
     
     <div data-title="destroys">
     All.
     </div>
     
     <div data-title="remarks">
     System error if the variable is archived. Use `_DelVarArc` to delete any
     variable. Notice that the inputs to this routine are the same as the
     outputs of `_FindSym`.
     </div>

The routines to create variables are

`_CreateCList`
:    Complex list

     <div data-title="input">
     HL
     :    Number of elements (<1000)
     </div>
`_CreateCplx`
:    Complex number

     <div data-title="input">
     None
     </div>
`_CreateEqu`
:    Equation

     <div data-title="input">
     HL
     :    Number of bytes
     </div>
`_CreatePict`
:    Picture

     <div data-title="input">
     None
     </div>
`_CreateProg`
:    Program

     <div data-title="input">
     HL
     :    Number of bytes
     </div>
`_CreateProtProg`
:    Protected program

     <div data-title="input">
     HL
     :    Number of bytes
     </div>
`_CreateReal`
:    Real Number

     <div data-title="input">
     None
     </div>
`_CreateRList`
:    Real list

     <div data-title="input">
     HL
     :    Number of elements (<1000)
     </div>
`_CreateRMat`
:    Matrix

     <div data-title="input">
     H
     :    rows (<100)
     L
     :    columns (<100)
     </div>
`_CreateStrng`
:    String

     <div data-title="input">
     HL
     :    Number of bytes
     </div>

For these routines, HL is the dimensions of the variable (see the table)
and OP1 holds the variable name. They output HL as a pointer to the VAT
entry (more info later), DE as a pointer to the data, and OP4 holding a
copy of the name.

When creating a parametric equation, you have to create both X and Y
parts or you'll get a crash.

Initializing Variables
----------------------

Variables must be initialized before the program ends or a freeze is
very likely. Each variable has a different structure for its data.

### Real

9 bytes in FP-number format. 

**3.14159265357**:

|      |      |      |      |      |      |      |      |      |
|------|------|------|------|------|------|------|------|------|
| \$00 | \$80 | \$31 | \$41 | \$59 | \$26 | \$53 | \$57 | \$00 |

### Complex

18 bytes in complex FP-number format.

**5219.86 - 0.1821*****i***:

|      |      |      |      |      |      |      |      |      |
|------|------|------|------|------|------|------|------|------|
| \$0C | \$83 | \$52 | \$19 | \$86 | \$00 | \$00 | \$00 | \$00 |
| \$8C | \$7F | \$18 | \$21 | \$00 | \$00 | \$00 | \$00 | \$00 |


### List

Two bytes with the number of elements. Followed by *n* × 9 bytes, where
*n* is the number of elements. Each element is an FP-number.

**{-234.5, 0.01005712, 5}**:

|      |      |      |      |      |      |      |      |      |
|------|------|------|------|------|------|------|------|------|
| \$03 | \$00 |      |      |      |      |      |      |      |
| \$80 | \$82 | \$23 | \$45 | \$00 | \$00 | \$00 | \$00 | \$00 |
| \$00 | \$7E | \$10 | \$00 | \$57 | \$12 | \$00 | \$00 | \$00 |
| \$00 | \$80 | \$50 | \$00 | \$00 | \$00 | \$00 | \$00 | \$00 |

### Complex List

Two bytes with the number of elements. Followed by 18 × *n* bytes, where
*n* is the number of elements. Each element is a complex FP-number.

**{1+2*****i*****, -4+8*****i*****}**

|      |      |      |      |      |      |      |      |      |
|------|------|------|------|------|------|------|------|------|
| \$02 | \$00 |      |      |      |      |      |      |      |
| \$0C | \$80 | \$10 | \$00 | \$00 | \$00 | \$00 | \$00 | \$00 |
| \$0C | \$80 | \$20 | \$00 | \$00 | \$00 | \$00 | \$00 | \$00 |
| \$8C | \$80 | \$40 | \$00 | \$00 | \$00 | \$00 | \$00 | \$00 |
| \$0C | \$80 | \$80 | \$00 | \$00 | \$00 | \$00 | \$00 | \$00 |

### Matrix

One byte with the number of columns, one byte with the number of rows.
Followed by *r* × *c* × 9 bytes, each of which is a real FP-number.
Matrices are organized in row-major order.

```
[ [14.95727575, -836.7575474, -33.57614396]
  [4.878167624, -85.56567278, 8.656019747 ] ]
```

|      |      |      |      |      |      |      |      |      |
|------|------|------|------|------|------|------|------|------|
| \$03 | \$02 |      |      |      |      |      |      |      |
| \$00 | \$81 | \$14 | \$95 | \$72 | \$75 | \$75 | \$00 | \$00 |
| \$80 | \$82 | \$83 | \$67 | \$57 | \$54 | \$74 | \$00 | \$00 |
| \$80 | \$81 | \$33 | \$57 | \$61 | \$43 | \$96 | \$00 | \$00 |
| \$00 | \$80 | \$48 | \$48 | \$78 | \$16 | \$76 | \$24 | \$00 |
| \$80 | \$81 | \$85 | \$56 | \$56 | \$72 | \$78 | \$00 | \$00 |
| \$00 | \$80 | \$86 | \$56 | \$01 | \$97 | \$47 | \$00 | \$00 |


### Picture

Two bytes with the number of bytes, which is a complete waste of RAM
since it's *always* \$02F4. Followed by a 96×63 bitmap (the bottom row
of pixels is not recorded) — 12 bytes to one row of pixels. The format
of a picture variable is explained on Day 24.

If you think for one second that I'm gonna give a full example, then
you've just gotta be high.

### Equation, Program, AppVar, String

Two bytes with the number of bytes. Followed by a bunch of tokens or a
mass of arbitrary data.

**String "CASIO SUX"**:

|      |      |      |      |      |      |      |      |      |
|------|------|------|------|------|------|------|------|------|
| \$09 | \$00 |      |      |      |      |      |      |      |
| `tC` | `tA` | `tS` | `tI` | `tO` | `tSpace` | `tS` | `tU` | `tX` |

