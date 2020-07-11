---
difficulty: 1
prev-lesson: day05
next-lesson: day07
title: Day 6
subtitle: Stacks
---

###What Is A Stack?

A stack is a special kind of data structure that has no fixed size. Its
size changes as data is added or removed from it. Stacks are usually
confined to a small amount of memory, but they can shrink to zero bytes
or grow until they take up all of the addressed memory on your calculator.

###How A Stack Works

All stacks operate in a last-in-first-out manner. What that means is
that the last item to be placed onto a stack ("pushed") is the first
item that is taken off ("popped"). Think of it as like one of those
dinner plate wells you see in buffets. Each plate is the value of a
register pair. If you store a new plate on top of the stack, you have to
push down all the others. If you remove a plate, the stack pops up. Now,
if you wanted to remove a plate that wasn't the topmost one, you
couldn't get it directly because the whole stack is sunken into the
counter. You would first have to remove all the plates on top of it.

###What You Need to Make A Stack

To have a fully operational stack structure you need two things: an amount
of memory the stack can exist in, and a stack pointer. The stack pointer is
a variable that tracks the address of the next free byte or of the topmost
entry.

A stack can change size in two ways. It can either it can grow up (new stack
entries exist at higher addresses than previous ones) or down (new stack
entries exist at lower addresses than previous ones).

Here is a pictorial example of a stack that grows up. The top of the
stack is currently address \$1009 and this is also the value of the
stack pointer. If we were to push an entry onto this stack, we would
write to \$1009. As this action would move the stack top one byte
forward, the stack pointer must then be incremented so that it once
again points to the top of the stack. On the other hand, if we wished to
pop an entry off this stack, we first decrement the stack pointer
because it currently points to nothing, then read from that address.

| \$1000 | \$1001 | \$1002 | \$1003 | \$1004 | \$1005 | \$1006 | \$1007 | \$1008 | \$1009          | \$100A | \$100B | \$100C | \$100D |
|-------|--------|--------|--------|--------|--------|--------|--------|--------|-----------------|--------|--------|-------|------|
|       |        |        |        |        |        |        |        |        | stack<br>pointer|        |        |     |   | 
| \$8C  | \$DB   | \$FA   | \$47   | \$46   | \$1F   | \$0D   | \$B8   | \$03   |                 |        |        |     |   |

Example: Push the DE register onto a stack that grows up.

        LD     HL, (stack_ptr)    ; Load stack pointer
        LD     (HL), E            ; Push the low-order byte
        INC    HL                ; Move stack pointer to next byte of available space
        LD     (HL), D            ; Push the high-order byte
        INC    HL
        LD     (stack_ptr), HL    ; Save new stack pointer

Example: Pop into DE the top 16 bits off a stack that grows up.

        LD     HL, (stack_ptr)
        DEC    HL                ; Move stack pointer to next byte on stack
        LD     D, (HL)            ; Pop the high-order byte
        DEC    HL
        LD     E, (HL)            ; Pop the low-order byte
        LD     (stack_ptr), HL    ; Save new stack pointer

What about a stack that grows down? The same rules apply, we just change
the direction the stack pointer moves. In the picture the top of the
stack is currently address \$FF00 and this once again must be the value
of the stack pointer. If we were to push an entry onto this stack, we
would decrement the stack pointer so it pointed to an empty slot, then
write to it.

| \$FEFA | \$FEFB | \$FEFC | \$FEFD | \$FEFE | \$FEFF | \$FF00 | \$FF01 | \$FF02 | \$FF03 | \$FF04 | \$FF05 | \$FF06 | \$FF07 |
|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
|        |        |        |        |        |   |stack<br>pointer |    |        |        |        |        |        |        |
|        |        |        |        |        |   |   \$8C          | \$DB | \$FA |   \$47 |  \$46  |  \$1F  |   \$0D |   \$B8 | 

Example: Push the DE register onto a stack that grows down.

        LD     HL, (stack_ptr)
        DEC    HL                ; Move stack pointer to next byte of available space
        LD     (HL), D            ; Push the high-order byte
        DEC    HL
        LD     (HL), E            ; Push the low-order byte
        LD     (stack_ptr), HL    ; Save new stack pointer

Example: Pop the top 16 bits of a register that grows down into DE

        LD     HL, (stack_ptr)
        LD     E, (HL)            ; Pop the low-order byte
        INC    HL
        LD     D, (HL)            ; Pop the high-order byte
        INC    HL
        LD     (stack_ptr), HL    ; Save new stack pointer

###The Z80's Stack

Stacks are very useful data structures. So much so that almost every
computer has specific instructions that operate on the stack.

`PUSH reg16`
:   Stores `reg16` to the stack. 
    `reg16` is *any* 16-bit register.

`POP reg16`
:   Retrieves `reg16` from the stack.
    `reg16` is *any* 16-bit register.

There is a special 16-bit register called SP that the Z80 uses as the
hardware stack pointer. The hardware stack (or just "the stack" for
short) is defined on the TI-83 Plus as a block of memory about 400 bytes
in size. This stack usually starts at \$0000 so as to place at the very
end of memory (the first push to the stack decrements the stack pointer
causing it to wrap around to \$FFFF). From this you could determine that
PUSH HL is equivalent to the discrete instructions (assuming for a
second that we could do LD (SP), H).

        DEC   SP
        LD    (SP), H
        DEC   SP
        LD    (SP), L

And that POP HL is identical to

        LD    L, (SP)
        INC   SP
        LD    H, (SP)
        INC   SP

Note that you can only PUSH/POP registers in pairs. So if you just want
to store E, you would have to do PUSH DE.

Also, you're under no obligation to POP into the same register you
PUSHed. This is perfectly acceptable:

        PUSH   AF
        POP    IX

Here is a sample code fragment that manipulates the stack with a diagram
showing how the stack looks through operation.

        LD     HL, $2145
        PUSH   HL            ;1
        LD     DE, $91FF
        PUSH   DE            ;2
        LD     BC, $0A33
        PUSH   BC            ;3
        POP    AF            ;4
        POP    HL            ;5
        POP    BC

![[NO IMAGE]](../img/stack.png)

You should use caution when you work with the stack. Since the operating
system also uses the stack, you actually have less than 400 bytes of
useable stack space. Nevertheless, this should be sufficient for all of
your needs.

One of the most important facts to keep in mind when working with the
stack is that your program should leave the stack in the exact same
state that it found it. In other words, each PUSH should have a
corresponding POP whatever registers are used. If your program does
not follow this rule, [undefined behavior](../ref/crash.html) will occur.