---
title: Day 10
subtitle: The Other Registers
prev-lesson: day09
next-lesson: day11
difficulty: 2
---
On Day 3, you got to look at the nine main registers of the Z80, and a
couple were introduced at various other points. Now we learn about the
remaining ones.

##Index Registers

You already know about the index regs, so here is a quick reveiw. There
are two 16-bit index registers: IX and IY. They are very similar to HL
except that they are slower to work with. They can be used anywhere HL
can, with the stipulation that the three registers are mutually
exclusive. That is, they cannot be mixed within one instruction:

        LD     IX, $40        ; Load $0040 into IX
        LD     IY, ($4552)    ; Load value at byte $4552 into IY
        LD     ($8000), IX    ; Load the value of IX into byte $8000
        ADD    IX, BC         ; Add BC to IX
        DEC    IY            ; Decrement IY
        ADD    HL, IY         ; Illegal!
        LD     H, (IX)        ; Note that this is okay

When using them to indirectly access memory, you can supply an 8-bit
signed offset value:

        LD     (IX - 5), A    ; Load A to the address in IX minus five.
        LD     B, (IY + 0)    ; Load from address in IY. Could also be simply (IY).

IX is free to use at any time, but IY is used by the calculator to
access the system flags. If you modify its value, you can restore it
with

        LD     IY, Flags

But use of IY is discouraged for now. There are things called interrupts
that have to be taken into consideration before it is safe for use.

The index registers are commonly used for addressing when HL is tied up
holding something vital, or where using an index would be more efficient
or coherent than a bunch of INC/DEC HL tricks. Such a case is accessing
complicated structures, such as you saw on Day 5.

###Index Register Halves

As you know, you can access the high and low bytes of IX and IY. It's a
little more complicated because the instructions aren't officially
supported by ZiLog, and it is a little on the unelegant side.
Nevertheless they can be useful in some circumstances, like when all
your registers are locked up and you desperately need an 8-bit counter.

The high byte of IX is called either IXH or HX (remember these are
unofficial registers so there are no standard names). The low byte is
called either IXL or LX. The high and low bytes of IY are named
similarly.

To use a part of an index register in an instruction:

1.  Pick an instruction that allows both H and L to be used as an
    operand, excepting shifts, rotates, BIT, SET, and RES.
2.  Use H if you want the high byte, or L if you want the low byte.
3.  Immediately precede this instruction with .DB `$DD` to use the IX
    half-registers, or .DB `$FD` to use the IY half-registers.

Example: LD E`, `IXH

        .DB    $DD
        LD     E, H

Example: SUB IYL

        .DB    $FD
        SUB    L

Be aware that once you specify a prefix, you are locked into using that
index register's half-registers. It is impossible to combine the
half-registers of HL, IX, or IY in one instruction:

        .DB    $DD    ;LD IXH, IXL
        LD     H, L

##Stack Pointer

To recap, the stack pointer is the 16-bit register SP. It holds the
address of the top of the hardware stack. A PUSH HL is identical to the
fake instructions

        DEC    SP
        LD     (SP), H
        DEC    SP
        LD     (SP), L

And a POP HL is identical to

        LD     L, (SP)
        INC    SP
        LD     H, (SP)
        INC    SP

What you don't know is that you can use SP in a number of instructions,
even use it to store data. Using it in this way is discouraged for the
same reasons as for IY.

        ADC    HL, SP

        ADD    HL, SP
        ADD    IX, SP
        ADD    IY, SP

        DEC    SP

        EX     (SP), HL
        EX     (SP), IX
        EX     (SP), IY

        INC    SP

        LD     (imm16), SP
        LD     SP, (imm16)
        LD     SP, HL
        LD     SP, IX
        LD     SP, IY
        LD     SP, imm16

        SBC    HL, SP

Probably the most valuable of these are the EX instructions. What they
do is swap the most recently pushed value on the stack with the 16-bit
register operand making it possible to manipulate two pieces of data
alternately.\
 The INC SP instruction is the next most useful, you can use it to clean
off register pushes to the stack, and while you could use POP, INC will
not store the data on the stack anywhere, which is really nice if you
are in a situation where all the registers contain vital data.

###Fast Load with SP

There are many useful hacks you can do with SP.Here are just a couple
of examples.

We can load a block of memory with one or two values really fast with
SP. The DI and EI instructions are needed because the calculator will
most likely crash without them:

        DI                       ; You don't need to know why this is necessary yet
        LD     (save_sp), SP      ; Save SP away
        LD     SP, $1000+1000     ; Have to start at the end because SP is    
                                 ; decremented before a PUSH
        LD     HL, $1050          ; Memory block will be 1050 1050 ...
        LD     B, 125             ; PUSH 125*4=500 times, @ 2 bytes a PUSH = 1000 bytes
    Loop:
        PUSH   HL
        PUSH   HL
        PUSH   HL
        PUSH   HL
        DJNZ   Loop
        LD     SP, (save_sp)      ; Restore SP
        EI                       ; You don't need to know why this is necessary yet

Here is a more concrete example, clearing out AppBackupScreen *fast*.

        DI
        LD    (save_sp), SP
        LD    SP, AppBackupScreen + 768    ; 768 byte area
        LD    HL, $0000
        LD    B, 48        ; PUSH 48*8=384 times, @ 2 bytes a PUSH = 768 bytes
    Loop:
        PUSH  HL          ; Do multiple PUSHes in the loop to save cycles
        PUSH  HL
        PUSH  HL
        PUSH  HL
        PUSH  HL
        PUSH  HL
        PUSH  HL
        PUSH  HL
        DJNZ  Loop

        LD    SP, (save_sp)
        EI
        RET
    save_sp:
        .DW   0

###Quit with SP
The stack pointer can be used to terminate the program instantly like
C's `exit()`.\
You already know that RET is like a POP PC. Since RET is used to end a
program, you can infer that the TI-OS uses CALL `$9D95` to execute a
program. If the value of SP was saved at the start of the program, it
could be later restored and followed with RET to stop the program:

        ;Start of program
        LD     (save_sp), SP
        .
        .
        .
        ;Somewhere within the program
        LD     SP, (save_sp)
        RET

This could be useful if you had to exit from deep within the program
because of an error, and you're unable to remove all the stack
pushes (such as from within a procedure).

##Memory Refresh Register

This is 8-bit register R. Bits 0 to 6 are incremented after each
instruction is executed, bit 7 staying at whatever was loaded. It can be
loaded to and from the accumulator.\
 I suppose it could be used in a random number generator:

        LD     A, ($9000)        ;A random number seed — make the result "more random"
        LD     B, A
        LD     A, R
        ADD    A, B
        LD    ($9000), A

But aside from that it really has no function for the programmer.

##Interrupt Vector Register and Shadow Registers

The Interrupt Vector Register is 8-bit register I. The Shadow Registers
are AF', BC', DE', and HL'. They are used with interrupts, so there's
nothing to be gained by explaining them now. Interrupts are covered in
full on [Day 22](day22.html).

