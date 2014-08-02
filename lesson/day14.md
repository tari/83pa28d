---
title: Day 14
subtitle: Procedures
prev-lesson: day13
next-lesson: day15
difficulty: 2
---

A procedure is a set of instructions designed to achieve some result,
such a calculating a function or displaying an image. A procedure is
invoked using the CALL instruction, and the procedure ends with the RET
instruction. This isn't exactly news to you, and you have seen dozens of
procedures already, but those were relatively simple examples. Today you
will learn how to create procedures that can do all the little tricks
that HLL procedures can.

## Procedures and the Stack

The call/return mechanism, to work effectively, needs to know from where
the `CALL` instruction was executed so that it can return properly. It
does this by pushing the PC register (actually it adds three so that the
address of the next instruction is pushed — the return address) onto the
stack. The `RET` instruction pops the top of the stack into PC. The LIFO
nature of the stack means a procedure can call a procedure which can
call another procedure, and so on *ad inifinitum* and they will all
return in the proper order.

Since the stack is used to store the return address, you must exercise
caution when pushing and popping from within a procedure. Check out this
defective procedure:

    Bollixed:
        PUSH    DE
        RET

The `RET` instruction isn't aware that the top of the stack isn't an
address, it's not as if there's a banner tagged on that says "hey `RET`
I'm not what you're looking for so you better not screw with me!". No,
it simply pops the top stack value blindly. Since it is very unlikely `DE`
contains a matching value (the odds are 1 in 65, 536), the program will
"return" into oblivion. Popping data before `RET` creates the same
problem. So just remember to take proper care of the stack in a
procedure.

## Stack Frames

Whenever you call a procedure, a certain amount of stack space is
allocated to hold information relating to that procedure, such as a
return address and saved registers. Such a block is called a stack
frame.

Stack frames are what give procedures the ability to call other
procedures (even themselves!) without the CPU getting confused. Before
returning, a procedure must clean up the stack frame until just the
return address exists.

## Saving the State of the Machine

This code attempts to print five lines of six X's. But don't try to run
it! It contains a bug that causes it to print six X's a line in an
infinite loop. The problem here is that both the calling code and the
procedure use the B register, but neither saves its value. The result:
PrintSpc returns with B equalling 0, causing the DJNZ in the main
program to loop forever.

### Program 14-1

        LD     B, 5
    Loop:
        CALL   PrintSpc
        b_call(_NewLine)
        DJNZ   Loop
        RET

    PrintSpc:
        LD     A, 'X'
        LD     B, 6
    PrintLoop:
        b_call(_PutC)
        DJNZ   PrintLoop
        RET

If a procedure will modify some registers, they should be saved with
PUSH/POP. Either the caller or the callee can take responsibility:

### Program 14-2

Procedure preserves registers.

        LD     B, 5
    Loop:
        CALL   PrintSpc
        b_call(_NewLine)
        DJNZ   Loop
        RET

    PrintSpc:
        PUSH   BC
        PUSH   AF

        LD     A, 'X'
        LD     B, 6
    PrintLoop:
        b_call(_PutC)
        DJNZ   PrintLoop

        POP    AF
        POP    BC
        RET

### Program 14-3

Calling code preserves registers.

        LD     B, 5
    Loop:
        PUSH   BC
        CALL   PrintSpc
        POP    BC
        b_call(_NewLine)
        DJNZ   Loop
        RET

    PrintSpc:
        LD     A, 'X'
        LD     B, 6
    PrintLoop:
        b_call(_PutC)
        DJNZ   PrintLoop
        RET

What is the practical difference between the two methods? When the
procedure saves the registers, then there is only one copy of the pushes
and pops. When the caller saves the registers, there must be a set of
pushes and pops around each `CALL`. Not only does this increase program
size, it can be difficult to always remember which registers need to be
saved.

On the other hand, if the calling code saves the registers, then time
doesn't need to be wasted preserving registers that don't need to be
preserved. In 14-2, the procedure saves both BC and AF, when there is no
real point in saving AF. In 13-3, the caller only saves BC since that is
the only register it cares about.

## Side Effects

A side effect is a computation done by a procedure that is purely
incidental. A procedure is ideally supposed to perform only one task
then exit. Sometimes, however, the steps necessary to execute that task
sometimes result in some data areas holding certain results. A
programmer that uses such results is doing side effect programming.
Example, the `ClrLCDFull` routine leaves BC equalling zero. You could
then use BC to set up text coordinates, which sounds pretty good. Hey,
save three bytes. But suppose that Texas Instruments introduces a new
operating system, wherein `ClrLCDFull` *preserves* BC. So what happens?
If you said "CRAAAASH!", then give yourself a dollar. Thus you can see
the big problem with SEP: side effects change. Even better, you have no
idea that the side effect has changed, so you can't fix the bug, get
frustrated, cry for your momma, and flood bulletin boards, forums, and
my e-mail with inane ramblings no one wants.

\<\\rant\>

Here is a related case against `SEP`. Doubtless you have seen files on
your computed that end in `.DLL`? The files are like procedure dumps
programs can use instead of having them inside the program. Some DLLs
come with an application when it is installed, others are native to
Windows (system DLLs). Oftentimes a software company will use these
system DLLs to cut down on size. Even craftier ones will look for side
effects to use. Now we get into a slight problem. Microsoft is
constantly improving, and the latest version of their proprietary
software may contain updates for their DLL files. Quiz: can anyone guess
what happens when a program tries to use the changed side effects? Did
someone say, "Blue Screen o' Death"? Maybe you noticed that when you
first installed Windows, it was a pretty solid OS. Then as you added
more third-party software, it got a little unstable. And once you got
the latest versions of Office™ and Internet Explorer™ it seemed to crash
every other day?

##Parameters

While quite a few procedures that are entirely self-contained, the
majority requre some kind of input to do their job, and many pass
results back to the calling code. Such inputs and outputs are called
*parameters*. When you are thinking about passing parameters to a
procedure, you'll ask yourself three questions.

-   How much data are you passing?
-   Where will the data come from?
-   How will the data be passed?

## Ways of Passing Parameters

These are the two main ways to pass parameters. While there are other
well-known methods, the architecture of the Z80's memory makes them
pointless.

### By Value

By Value means to send just a value to the procedure. A copy of the
input parameter is created and it is this copy that is used throughout
the subroutine. The point of by value is for the preservation of the
input data over the procedure.

    ; Pass the variable val to a procedure by value

    ; Make a copy of the variable
        LD     A, (val)
        CALL   ByVal
        RET

    ByVal:
    ; A holds the input parameter, since we have no access to the original variable
    ; (not entirely true, but just play along), it can't be modified
        AND   $0F
        XOR   $07
        b_call(_PutC)
        RET

    val:    .DB    99

The size of the data is a deciding factor in choosing to use By Value.
Since a full copy must be made, By Value is only good for small data
objects and absolutely abyssmal for larger structures.

Parameters passed by value are input-only. You can pass them to a
procedure, but the procedure can't use them for return data.

### By Reference

To pass a parameter by reference you pass its address, in other words, a
pointer to it. The routine dereferences the pointer and indirectly
accesses the parameter, and as a consequence has the ability to alter
it. It is an excellent mechanism for large amounts of data, or whenever
you want to enable modification of the parameters.

    ; Pass the variables val1 and val2 to a procedure by reference

    ; Create pointers in DE and HL to the variables
        LD     HL, val1
        LD     DE, val2
        CALL   ByRef
        RET

    val1:   .DB    200
    val2:   .DB    46

    ByRef:
    ; HL and DE hold the address of the parameters and so must be dereferenced.
        LD     A, (DE)
        ADD    A, (HL)
        LD     (DE), A
        RET

For small amounts of data, pass by reference is usually less efficient
than passing by value because the parameters have to be dereferenced
each time they are accessed, and dereferencing is slower than using a
value.

Parameters passed by reference can be used for input or output.

## Places for Passing Parameters

Now that you know how to pass parameters, you probably have the nerve to
ask where you can pass them. The place you put a parameter depends a
great deal on the size and number of parameters.

### Via Registers

If the amount of data being passed is only a small number of bytes, then
by all means use the registers to pass them. This method has been used
throughout this guide and also by the system routines. There are only a
finite and very small number of registers, though. When you run out of
them, you need to look into using RAM.

### Via Global Variables

Using global variables, reserved bits of RAM in the program or scram
memory, is the easiest way to pass a parameter. Many TIOS routines to
this also. The problem is that it smacks of inelegance, and even worse
it's hard to maintain what RAM is safe and what is used by a procedure.

### Via the Code Stream

Immediately after the CALL to the procedure, place the parameters inline
with one or several .DB or .DW statements. Okay, this looks real cool,
but the way to access these parameters may elude you until you realize
that the return address, the top stack value, is the address of the
first parameter. So you pop HL, and if off to the races (this is one of
those rare exceptions to the rule of not popping without pushing
something first).

Now one problem, if you put back the return address, you will return
right after the CALL and the data block will be executed as code. This
is solved by modifying the return address so that it points to just
after the parameters. Not too difficult to do that because you will
usually be at the end of the parameter list when you want to return
anyway.

### Program 14-4

        LD     HL, 0
        LD     (CurRow), HL
        CALL   Print_Out
        .DB    "I ain't not a dorkus", 0
        RET

    Print_Out:
    ; Get the return address/address of parameter
        POP    HL
    _Loop:
        LD     A, (HL)
        INC    HL
        OR     A
        JR     Z, _Done
        b_call(_PutC)
        JR     _Loop
    _Done:
    ; Much better than POP HL \ RET
        JP     (HL)

You have no excuse for not understanding the code stream mechanism —
you've been using it all this time! `b_call(xxxx)` is macro (you should
know at least that much by now) that expands to

        RST    28h
        .DW    xxxx

RST is the same as CALL, but you can clearly see that the code stream is
in use here.

The code stream really is one of the more convenient ways to pass input,
and code-stream parameters implement variable-length parameters quite
effectively. The string parameter to Print\_Out can be any length and
the routine will always come off without a hitch.

For all its convenience, the code stream mechanism is not without its
disadvantages. First, if you fail to pass exactly the right number of
parameters in exactly the right format, the code stream becomes the
crash stream. Try leaving off the zero byte, Print\_Out prints garbage
and returns to god-knows-where. Or you might accidently add in a second
zero. Then Print\_Out returns in the midst of the string and tries to
execute ASCII codes as instruction opcodes. Again, this usually results
in a crash (actually most characters will be 8-bit loads that may or may
not be harmless).

### Via The Stack

Most HLLs use the stack to pass parameters because of its decent
efficiency. While certainly slower than using registers, the stack lets
you pass a large amount of parameter data (within reason) without
difficulty. To pass parameters on the stack, right before you call the
procedure, push all the parameters to be used. Now, how to access those
parameters. Consider this:

    ;    $
        A48E:    LD     HL, $1C2A
        A491:    PUSH   HL
        A492:    LD     HL, $5FC0
        A495:    PUSH   HL
        A496:    LD     HL, $44DF
        A499:    PUSH   HL
        A49A:    CALL   Foo
        A49D:    INC    A

Upon entry to Foo, its stack frame will look like:

| \$FFE5 | \$FFE6 | \$FFE7 | \$FFE8 | \$FFE9 | \$FFEA | \$FFEB | \$FFEC | \$FFED | \$FFEE | \$FFEF | \$FFF0 |
|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
|        |        |        |        | \$9D   | \$A4   | \$DF   | \$44   | \$C0   | \$5F   | \$2A   | \$1C   |
|        |        |        |        | Return | Address | Parameter | 3  | Paremeter | 2   | Paremeter | 1   |
|        |        |        |        | SP     |        |        |        |        |        |        |        |

With this as a guide, we can devise two mechanisms of accessing these
parameters.

#### 1. Using the EX Instruction

This method was available on the Intel 8080 and is still viable. It
involves using a form of EX.

`EX (SP), HL`
:    Swaps the value of `(SP)` with the
     value of `L` and the value of
     `(SP+1)` with the value of `H`.

What can now be done is issue a POP HL as the first instruction of Foo.
This will deliver the return address in HL and cause SP to point to the
third parameter. By a series of pops and exchanges, the arguments can be
cleaned off and the return address put back on top.

    Foo:
        POP    HL         ; HL = return
        EX     DE, HL
        POP    HL         ; HL = parameter 3
        LD     (Par3), HL
        POP    HL         ; HL = parameter 2
        LD     (Par2), HL
        EX     DE, HL
        EX     (SP), HL    ; HL = parameter 1

If the arguments are to be used more than once they will have to be
stored to RAM. This requires space and bogs the system down.

#### 2. Using an Index Register

The second method involves reading the parameters directly in the stack.
The best way this can be accomplished is by putting the value of SP into
an index register and then looking up the parameters by offsetting.
While there is no way to directly load the stack pointer into an index
register, this will do just as well:

    ; If you save the machine state, put the number of bytes pushed
    ; instead of zero in IX
        LD     IX, 0
        ADD    IX, SP

The parameters to Foo would be as follows:

(IX + 0) LSB of return address\
 (IX + 1) MSB of return address\
 (IX + 2) LSB of parameter 3\
 (IX + 3) MSB of parameter 3\
 (IX + 4) LSB of parameter 2\
 (IX + 5) MSB of parameter 2\
 (IX + 6) LSB of parameter 1\
 (IX + 7) MSB of parameter 1

The use of indexing offers some glaring disadvantages:

1.  Instructions with index registers are very slow and large.
2.  The parameters are not removed from the stack. Their removal must
    come after control is returned to the caller, or at the end with
    `EX (SP), HL`.

Although, you could do the same thing with HL, which would result in
faster, but less convenient and readable code.

### Via a Parameter Block

A parameter block is a structure containing the parameters. To access
them you would pass a pointer to the structure, so parameter blocks are
supposed to be passed by reference. Parameter blocks are especially
useful when you have to make several calls to a procedure, and each
invocation you pass constant data (or the data is modified in the
procedure). If the parameters change you will have to explicitly modify
the parameter block, and this is less efficient (you are basically using
a global variable).

## Procedure Results


At times, a procedure's point in life will be to calculate some value.
You store the return value in an input reference parameter, or you can
use a new method called Pass By Result. To pass by result you just store
a copy of the output value somewhere. Like passing by value turned on
its head.

Procedure results can be stored in most of the ways input paramters can
be (except the code stream). To use the stack, special considerations
have to be made.

### Using that Friggin' EX (SP), HL

So the top of the stack is the return address, and HL holds the return
value?

        EX     (SP), HL
        JP     (HL)
        . . .
    ; Back in the main module
        POP    BC    ; Result in BC

This can be extended for multiple values.

        CALL   Fetch
        POP    HL
        POP    BC
        POP    DE
        RET

    Fetch:
        LD     HL, (Data1)
        EX     (SP), HL
        EX     DE, HL
        LD     HL, (Data2)
        PUSH   HL
        LD     HL, (Data3)
        PUSH   HL
        PUSH   DE
        RET

### Using that Friggin' Index Register

Pretty simple, you just use your index register to overwrite the input
parameters. If you need more space, push garbage values onto the stack
beforehand as placeholders.

        CALL   Fetch
        POP    HL
        POP    BC
        POP    DE
        RET

    Fetch:
        EX     (SP), HL
        PUSH   AF    ; Placeholders
        PUSH   AF
        PUSH   HL

        LD     DE, (Data1)
        LD     (IX + 7), D
        LD     (IX + 6), E

        LD     DE, (Data2)
        LD     (IX + 5), D
        LD     (IX + 4), E

        LD     DE, (Data3)
        LD     (IX + 3), D
        LD     (IX + 2), E

        RET

## Local Variables

At times, a procedure may need some temporary storage as it runs. To
allocate for local variables, subtract SP. At termination, deallocate by
adding. These local variables are best accessed using indexing.

### Program 14-5

Okay, I absolutely agree that this is this is a mind-numbingly stupid
and *horrendously* inefficent routine, but it does demonstrate local
variables.

        LD     HL, $0000
        LD     DE, $FFFF
        PUSH   HL
        PUSH   DE
        CALL   Swap
        POP    DE
        POP    HL
        RET

    Swap:
    #define    p1_lo    (IX + 2)
    #define    p1_hi    (IX + 3)
    #define    p2_lo    (IX + 4)
    #define    p2_hi    (IX + 5)
    #define    temp    (IX - 1)

        LD     IX, $0000
        ADD    IX, SP
        DEC    SP    ; Allocate one byte of local vars

        LD     A, p1_lo
        LD     temp, A
        LD     A, p2_lo
        LD     p1_lo, A
        LD     A, temp
        LD     p2_lo, A

        LD     A, p1_hi
        LD     temp, A
        LD     A, p2_hi
        LD     p1_hi, A
        LD     A, temp
        LD     p2_hi, A

        INC    SP    ; Deallocate one byte of local vars
        RET

When is it a good idea to use local variables? Never. Local variables
are invariably useless the way the Z80 implements them. But on the
bright side if it ever comes up at a party you can say how to allocate
local variables in a procedure :-).

## Recursion

Recursion occurs when a procedure calls itself repeatedly, not unlike an
iterative loop. Like any other loop, a recursive procedure requires a
termination condition (called the base case) to stop an infinite loop.
To qualify for recursion, a procedure must be re-entrant. This means
that the procedure can restart and terminate without disturbing any
previous recursions. For this reason, extensive use of the stack is
necessary. Inputs in RAM have to be placed on the stack, and inputs in
registers must be preserved in the procedure. Recursion can gobble up a
lot of stack space in a very short time.

### Program 14-6

I'm sure that C.A.R. Hoare's QuickSort is the most famous and impressive
example of a recursive procedure, so here is how to do a 16-bit
factorial.

        b_call(_ClrLCDFull)
        b_call(_HomeUp)
        LD     HL, 8          ; Do not try passing inputs greater than 8, 
                             ; it will make the routine unhappy
        PUSH   HL
        CALL   Factorial
        POP    HL
        b_call(_DispHL)
        b_call(_NewLine)
        RET

    Factorial:
        PUSH   IX            ; Save previous value of IX for re-entrancy
        LD     IX, 0          ; Set IX as stack frame pointer
        ADD    IX, SP

        LD     A, (IX + 4)    ; Get the LSB of the factor
        OR     A             ; The base case is "factor == 0"
        JR     Z, BaseCase
        DEC    A             ; Subtract one to get next factor
        LD     E, A           ; Push factor onto stack as parameter for next
        PUSH   DE            ; recursion. The value of D is irrelevant
        CALL   Factorial     ; Recurse

        POP    HL            ; Retrieve the result from the previous recursion
        LD     E, (IX + 4)    ; Get the factor from the previous recursion
        CALL   HL_Times_E    ; Multiply 'em
        LD     (IX + 4), L    ; Overwrite the previous factor with running product
        LD     (IX + 5), H
        POP    IX            ; Restore stack frame pointer from previous recursion
        RET                  ; End of this recursion

    BaseCase:
        LD     (IX + 4), 1    ; Set the $0000 factor to $0001
        LD     (IX + 5), 0
        POP    IX            ; Restore stack frame pointer
        RET                  ; End of this recursion

