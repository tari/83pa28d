---
tocpath: ../
title: Day 7
subtitle: Control Structures
difficulty: 1
prev-lesson: day06
next-lesson: day08
---

Left to its own devices, a Z80 program will perform its instructions in
the same order that the appear in the source file, starting with the
very first, and progressing, step-by-step, until the end. However this
order is rarely, if ever, encountered in real Z80 programs. The Z80
vocabulary has a number of instructions that allow you to manipulate
execution.

Z80 Hopscotch
-------------

What we have here are two instructions that correspond to the `goto`
statement you see in higher-lever languages.

`JP label`
:    Causes execution to jump to `label`.

At first glance, JP and JR look exactly the same. There are a few key
differences, though:

1.  JR has a limited range of where it can jump. Specifically, it can
    jump forwards 129 bytes, or backwards 126 bytes... though this
    generally isn't something you can calculate easily. JP on the other
    hand, can jump to anywhere in memory you want, even outside your
    program.
2.  When compiled JR takes up one less byte than JP.
3.  JR takes 7 or 12 cycles, JP always takes 10 cycles.

If you want my opinion, opt for JR whenever possible, unless you're
*really* desperate for a quick program. You don't have to worry about
the range limitation, because when you assemble, TASM will give you a
"Range of relative branch exceeded" error for each JR instruction that's
overreaching itself. It's then just a matter of finding each offending
JR and replacing it.

Example:

        LD     A, 25
        INC    A
        JR     SkipOver
        SUB    12        ; These two statements are never executed.
        ADD    A, B
    SkipOver:            ; JR branches to here.
        JR     Exit      ; Results in an error because the exit label is too far away.
        ; Pretend a whole lotta stuff is here. ;
    Exit:
        RET

JR and JP, when used in this way, are *unconditional*. That is,
execution will *always* jump to the specified label. This is nice, but
not always useful. What we can do is use conditionals so that the jump
is taken only when certain conditions are met. If not, the instruction
will just be ignored.

Conditionals
------------

To jump conditionally, modify the JP/JR syntax:

        JP    condition, label

`condition` is any one of the conditions listed below.

<div class="no-pop">
`Z`
:    If the zero flag is set.
`NZ`
:    If the zero flag is reset.
`C`
:    If the carry flag is set.
`NC`
:    If the carry flag is reset.
`PE`
:    If the parity/overflow flag is set.
`PO`
:    If the parity/overflow flag is reset.
`M`
:    If the sign flag is set.
`P`
:    If the sign flag is reset.
</div>

Four instructions can be used conditionally: CALL (discussed later on),
RET, JP, and JR. JR is handicapped in that it can only be used with the
conditions hilighted in blue.

One of the best ways to set off a conditional jump is to use the CP
instruction. CP is identical to the SUB instruction except that the
accumulator is left intact. Its only job is to compare how the
accumulator relates to another value.

`CP { imm8 | reg8 | (HL) }`
:    Subtracts the operand from the accumulator, but does not actually *affect*
     the accumulator.

     S
     :    affected
     Z
     :    affected
     P/V
     :    detects overflow
     C
     :    affected

By using a series of CP and JR instructions, we can create a crude
version of the `if...then` statements as seen in C. However, you have to
be careful if you are comparing unsigned or signed values.

| Comparison | Unsigned | Signed |
|------------|----------|--------|
| `A == num` | Z flag is set | Z flag is set |
| `A != num` | Z flag is reset | Z flag is reset |
| `A < num`  | C flag is set | S and P/V are different |
| `A >= num` | C flag is reset | S and P/V are the same |

Example:

        CP    20
        JR    Z, label1     ; If the accumulator is 20, then will jump.
        CP    15           ; If it isn't, then...
        JR    Z, label2     ;         If the accumulator is 15, then will jump.
        CP    10           ; If it isn't, then...
        JR    NC, label3    ;         If the accumulator is 10 or more, then will jump.

I'm going to guess, that since all you have to do is check the carry
flag, and are able to use JR, you'll be keeping all your comparisons
unsigned. Although you may need to a signed comparison now and then. In
that case, you'll need to know how to chain conditions.

Chaining Conditions
-------------------

At times you may need to have more than one condition at the same time.
While checking conditions simultaneously in assembly is impossible, with
some clever code ordering you can achieve the same effect.
For these examples, assume that there is a label in your code called
success that should be executed if the condition passes, and a label
called fail that should be executed if the condition fails.

### Conjunction (AND)

> Conjunction junction, what's your function?[^conjunction]

[^conjunction]: Sorry, couldn't resist. Come to think of it, *I'm* too young to
know what that is. Next I'll be talking about some crappily animated piece of
legislation bitching about how a bunch of corrupt Uncle Sam-types won't ratify
him. :D

If we have two conditions, and we want success to be executed only if
both conditions are true, then check each condition in any order, and
jump to fail once a condition fails.

E.g. this C code

```c
if( (a >= 7) && (a != 8) )
    goto success;
else
    goto fail;
```

could be translated into assembly as

        CP     7
        JR     C, fail
        CP     8
        JR     Z, fail
    success:
        ;This code executed if condition passes.
    fail:
        ;This code executed if condition fails.

### Disjunction (OR)

If we have two conditions, and we want success to be executed if either
condition is true, then check each condition in any order, and jump to
success once a condition passes.

E.g.

```c
if( (a >= 7) || (a != 8) )
    goto success;
else
    goto fail;
```

        CP     7
        JR     NC, success
        CP     8
        JR     NZ, success
    fail:
        ;This code executed if condition fails.
    success:
        ;This code executed if condition passes.

### A Logical Cocktail

If you want to mix AND and OR conditions, it's simple. You just have to
order the checks the right way.

E.g.

```c
if( (a >= 7 && a != 8) || a == 1 )
    goto success;
else
    goto fail;
```

Let's see? Looking at the expression, because it's OR, if A equals 1
then the entire expression will be true, so:

        CP     1
        JR     Z, success

In the event there was no jump, then we can still jump to success if A
is both greater than or equal to seven while not being equal to eight
(again, because it's OR). So you just put in the conjunction
construction:

        CP     7
        JR     C, fail
        CP     8
        JR     Z, fail
    success:
        .
        .
        .
    fail:
        .
        .
        .

Loops
-----

If you remember from Day 5 you saw this code to handle an array of
structures:

        LD    IX, AppBackupScreen     ; Get array base
        LD    DE, sizeof              ; Use this to update IX

        LD    A, (IX + x)
        ADD   A, (IX + dx)
        LD    (IX + x), A
        ADD   IX, DE

        LD    A, (IX + x)
        ADD   A, (IX + dx)
        LD    (IX + x), A
        ADD   IX, DE

        LD    A, (IX + x)
        ADD   A, (IX + dx)
        LD    (IX + x), A
        ADD   IX, DE

        LD    A, (IX + x)
        ADD   A, (IX + dx)
        LD    (IX + x), A

You ought to see that there is a set of three instructions (four if you
append an extra ADD) that are repeated over and over. In cases like
these it is simply not practical to write out the code again and again
for as many times as we require, and furthermore the number of
repetitions necessary might change as the program runs. To relieve
burdens such as this, you can and should create a loop.

A loop is nothing more than a collection of instructions that are to be
executed multiple times. All loops consist of three components: an
initialization, a termination test, and a loop body. The initialization
is simply the setup before the loop starts. The termination test is used
by the loop to see if it should stop or repeat. The loop body is the
statements not dedicated to control of the loop that are executed. The
permutations of these three components dramatically change the way a
loop operates.

### While Loops

The most general loop is the while loop. It takes the following form in
C:

```c
while (expression)
{
   statements
}
```

There is one important aspect of the while loop: the test for
termination appears at the start of the loop. As a direct consequence,
the loop body may never even be executed.

Consider the following implementation of a while loop:

```c
int x = 0;
while (x < 100)
    x++;
```

`x = 0` is the initialization. `x < 100` is the termination condition
i.e. the loop will not end as long as `x` is less than 100. `x` is
termed a loop control variable, because it controls whether or not the
loop will terminate. `x++` is the body and is the code that executes on
each pass through the loop.\
 You can convert this to Z80 as:

        LD     A, 0          ; Initialization
    While:
        CP     100          ; Loop termination test
        JR     C, EndWhile
        INC    A            ; Loop body
        JR     While
    EndWhile:

### Do...While Loops

The do...while loop differs from the while loop in only one respect: the
termination test comes at the end of the loop body. Due to this, a
do...while loop is guaranteed to execute a minimum of once.

```c
int x = 0;
do
{
    x++;
} while (x < 100);
```

        LD     A, 0
    Do:
        INC    A
        CP     100
        JR     NZ, Do

The do-style loop, you'll notice, has one less jump instruction in it
than its while counterpart. Therefore the do...while loop runs faster,
so **always, always use do...while loops!** If you need to check the
inital value of the test variable, do it just before the loop begins.

### For Loops

A for loop is a special loop that executes a specific number of times.
It does this by increasing or decreasing a loop control variable by a
fixed amount on each iteration. For loops such as these, the Z80
provides a single instruction to handle the termination test, jump to
the beginning, and variable update. And what a surprise, it does it as a
do...while loop.

`DJNZ label`
:    Subtracts 1 from register `B` and if it isn't zero, jumps to `label`.

Example: Suppose you wanted to decrement A 100 times, and you didn't
feel like using SUB:

        LD     B, 100
    loop:
        DEC    A
        DJNZ   loop

DJNZ is functionally equivalent to the following insructions (minus the
modification to the flags), so if circumstances dictate that you can't
use B, you know how to fabricate a replacement:

        DEC    B
        JR     NZ, label

The choice of JR was intentional, because both instructions are subject
to the same range limitations. Be aware, too, that because DJNZ
decrements B before it checks if it is zero, an initial value of zero
for B will result in an overflow and 256 iterations. Therefore, you may
want to check the value of B before entering the loop if this would be a
concern.

Procedures
----------

A procedure is a set of instructions that perform some task or calculate
some value. What separates procedures from normal code is that the
procedure is likely to be called upon many times at different points in
a program. Rather than put the same code at each of those points, use
just one procedure. The instructions CALL and RET provide the means to
implement procedures.

`CALL label`
:    Causes execution to jump to `label`, returning when a `RET` instruction
     is executed.

To understand CALL fully, you need to be aware of a specialized register
called the program counter PC. The program counter is analogous to
TASM's location counter: it holds the address of the currently executing
instruction. What literally happens during CALL is that the current
program counter value is pushed onto the stack, then a transfer to the
label is done. Without saving the program counter, it would be
impossible to know where to return. RET pops the top stack value into
the program counter.

Procedures are too intricate to do them justice in just a couple
paragraphs. In fact a whole day has been delegated to explain them
further.
