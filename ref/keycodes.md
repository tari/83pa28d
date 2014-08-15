---
title: Key Codes
tocpath: ../lesson/
---

These are the codes returned from the `GetKey` routine. They are grouped into
four categories.

<div class="no-pop">
Primary-function
:    Press the key
2nd-function
:    Press <kbd>2nd</kbd>
Alpha-function
:    Press <kbd>ALPHA</kbd>
Alpha-Alpha function
:    Press <kbd>ALPHA</kbd> twice

There are no codes for <kbd>2nd</kbd> + Up or <kbd>2nd</kbd> + Down, they always change the contrast.

Alpha-Alpha keys must be enabled with `set LwrCaseActive, (IY +
AppLwrCaseFlag)`. `KExtendEcho2` (\\$FC) is always returned in A.
`(KeyExtend)` holds the keycode.

## Primary-function keys

| Key | Equate | Value |
|-----|--------|-------|
| <kbd>Y=</kbd> | kYEqu | \$49 |
| <kbd>WINDOW</kbd> | kWindow | \$48 |
| <kbd>ZOOM</kbd> | kZoom | \$2E |
| <kbd>TRACE</kbd> | kTrace | \$5A |
| <kbd>GRAPH</kbd> | kGraph | \$44 |
| | | |
| <kbd>MODE</kbd> | kMode | \$45 |
| <kbd>DEL</kbd> | kDel | \$0A |
| <kbd>◀</kbd> | kLeft | \$02 |
| <kbd>▲</kbd> | kUp | \$03 |
| <kbd>▶</kbd> | kRight | \$01 |
| | | |
| <kbd>X,T,θ,n</kbd> | kVarX | \$B4 |
| <kbd>STAT</kbd> | kStat | \$31 |
| <kbd>▼</kbd> | kDown | \$04 |
| | | |
| <kbd>MATH</kbd> | kMath | \$32 |
| <kbd>APPS</kbd> | kAppsMenu | \$2C |
| <kbd>PRGM</kbd> | kPrgm | \$2D |
| <kbd>VARS</kbd> | kVars | \$35 |
| <kbd>CLEAR</kbd> | kClear | \$09 |
| | | |
| <kbd>x^-1^</kbd> | kInv | \$86 |
| <kbd>SIN</kbd> | kSin | \$B7 |
| <kbd>COS</kbd> | kCos | \$B9 |
| <kbd>TAN</kbd> | kTan | \$BB |
| <kbd>^</kbd> | kExpon | 84 |
| | | |
| <kbd>x^2^</kbd> | kSquare | \$BD |
| <kbd>,</kbd> | kComma | \$8B |
| <kbd>(</kbd> | kLParen | \$85 |
| <kbd>)</kbd> | kRParen | \$86 |
| <kbd>÷</kbd> | kDiv | \$83 |
| | | |
| <kbd>LOG</kbd> | kLog | \$C1 |
| <kbd>7</kbd> | k7 | \$95 |
| <kbd>8</kbd> | k8 | \$96 |
| <kbd>9</kbd> | k9 | \$97 |
| <kbd>×</kbd> | kMul | \$82 |
| | | |
| <kbd>LN</kbd> | kLn | \$BF |
| <kbd>4</kbd> | k4 | \$92 |
| <kbd>5</kbd> | k5 | \$93 |
| <kbd>6</kbd> | k6 | \$94 |
| <kbd>-</kbd> | kSub | \$81 |
| | | |
| <kbd>STO→</kbd> | kStore | \$8A |
| <kbd>1</kbd> | k1 | \$8F |
| <kbd>2</kbd> | k2 | \$90 |
| <kbd>3</kbd> | k3 | \$91 |
| <kbd>+</kbd> | kAdd | \$80 |
| | | |
| <kbd>0</kbd> | k0 | \$8E |
| <kbd>.</kbd> | kDecPnt | \$8D |
| <kbd>(-)</kbd> | kChs | \$8C |
| <kbd>ENTER</kbd> | kEnter | \$05 |

## Second-function keys

| Key | Equate | Value |
|-----|--------|-------|
| <kbd>STAT PLOT</kbd> | kStatEd | \$43 |
| <kbd>TBLSET</kbd> | kTblSet | \$4B |
| <kbd>FORMAT</kbd> | kFormat | \$57 |
| <kbd>CALC</kbd> | kCalc | \$3B |
| <kbd>TABLE</kbd> | kTable | \$4A |
| | | |
| <kbd>QUIT</kbd> | kQuit | \$40 |
| <kbd>INS</kbd> | kIns | \$0B |
| <kbd>2nd</kbd> + <kbd>◀</kbd> | kBOL | \$0E |
| <kbd>2nd</kbd> + <kbd>▶</kbd> | kEOL | \$0F |
| | | |
| <kbd>LINK</kbd> | kLinkIO | \$41 |
| <kbd>LIST</kbd> | kList | \$3A |
| | | |
| <kbd>TEST</kbd> | kTest | \$33 |
| <kbd>ANGLE</kbd> | kAngle | \$39 |
| <kbd>DRAW</kbd> | kDraw | \$2F |
| <kbd>DISTR</kbd> | kDist | \$38 |
| | | |
| <kbd>MATRX</kbd> | kMatrix | \$37 |
| <kbd>SIN^-1^</kbd> | kASin | \$B8 |
| <kbd>COS^-1^</kbd> | kACos | \$BA |
| <kbd>TAN^-1^</kbd> | kATan | \$BC |
| <kbd>&pi;</kbd> | kPi | \$B5 |
| | | |
| <kbd>√</kbd> | kSqrt | \$BE |
| <kbd>EE</kbd> | kEE | \$98 |
| <kbd>{</kbd> | kLBrace | \$EC |
| <kbd>}</kbd> | kRBrace | \$ED |
| <kbd>e</kbd> | kCONSTeA | \$EF |
| | | |
| <kbd>10^x^</kbd> | kALog | \$C2 |
| <kbd>u</kbd> | kUnA | \$F9 |
| <kbd>v</kbd> | kVnA | \$FA |
| <kbd>w</kbd> | kWnA | \$FB |
| <kbd>\[</kbd> | kLBrack | \$87 |
| | | |
| <kbd>e^x^</kbd> | kExp | \$C0 |
| <kbd>L4</kbd> | kL4A | \$F6 |
| <kbd>L5</kbd> | kL5A | \$F7 |
| <kbd>L6</kbd> | kL6A | \$F8 |
| <kbd>\]</kbd> | kRBrack | \$88 |
| | | |
| <kbd>RCL</kbd> | kRecall | \$0C |
| <kbd>L1</kbd> | kL1A | \$F3 |
| <kbd>L2</kbd> | kL2A | \$F4 |
| <kbd>L3</kbd> | kL3A | \$F5 |
| <kbd>MEM</kbd> | kMem | \$36 |
| | | |
| <kbd>OFF</kbd> | kOff | \$3F |
| <kbd>CATALOG</kbd> | kCatalog | \$3E |
| <kbd>i</kbd> | kI | \$EE |
| <kbd>ANS</kbd> | kAns | \$C5 |
| <kbd>ENTRY</kbd> | kLastEnt | \$0D |

## Alpha-function keys

| Key | Equate | Value |
|-----|--------|-------|
| Page Up | kAlphaUp | \$07 |
| Page Down | kAlphaDown | \$08 |
| | | |
| <kbd>A</kbd> | kCapA | \$9A |
| <kbd>B</kbd> | kCapB | \$9B |
| <kbd>C</kbd> | kCapC | \$9C |
| | | |
| <kbd>D</kbd> | kCapD | \$9D |
| <kbd>E</kbd> | kCapE | \$9E |
| <kbd>F</kbd> | kCapF | \$9F |
| <kbd>G</kbd> | kCapG | \$A0 |
| <kbd>H</kbd> | kCapH | \$A1 |
| | | |
| <kbd>I</kbd> | kCapI | \$A2 |
| <kbd>J</kbd> | kCapJ | \$A3 |
| <kbd>K</kbd> | kCapK | \$A4 |
| <kbd>L</kbd> | kCapL | \$A5 |
| <kbd>M</kbd> | kCapM | \$A6 |
| | | |
| <kbd>N</kbd> | kCapN | \$A7 |
| <kbd>O</kbd> | kCapO | \$A8 |
| <kbd>P</kbd> | kCapP | \$A9 |
| <kbd>Q</kbd> | kCapQ | \$AA |
| <kbd>R</kbd> | kCapR | \$AB |
| | | |
| <kbd>S</kbd> | kCapS | \$AC |
| <kbd>T</kbd> | kCapT | \$AD |
| <kbd>U</kbd> | kCapU | \$AE |
| <kbd>V</kbd> | kCapV | \$AF |
| <kbd>W</kbd> | kCapW | \$B0 |
| | | |
| <kbd>X</kbd> | kCapX | \$B1 |
| <kbd>Y</kbd> | kCapY | \$B2 |
| <kbd>Z</kbd> | kCapZ | \$B3 |
| <kbd>θ</kbd> | kThetA | \$CC |
| <kbd>"</kbd> | kQuotE | \$CB |
| | | |
| <kbd>\_</kbd> | kSpace | \$99 |
| <kbd>:</kbd> | kColon | \$C6 |
| <kbd>?</kbd> | kQuest | \$CA |
| <kbd>SOLVE</kbd> | kAlphaEnter | \$06 |

## Alpha-Alpha-function keys

| Key | Equate | Value |
|-----|--------|-------|
| <kbd>a</kbd> | kLa | \$E2 |
| <kbd>b</kbd> | kLb | \$E3 |
| <kbd>c</kbd> | kLc | \$E4 |
| | | |
| <kbd>d</kbd> | kLd | \$E5 |
| <kbd>e</kbd> | kLe | \$E6 |
| <kbd>f</kbd> | kLf | \$E7 |
| <kbd>g</kbd> | kLg | \$E8 |
| <kbd>h</kbd> | kLh | \$E9 |
| | | |
| <kbd>i</kbd> | kLi | \$EA |
| <kbd>j</kbd> | kLj | \$EB |
| <kbd>k</kbd> | kLk | \$EC |
| <kbd>l</kbd> | kLl | \$ED |
| <kbd>m</kbd> | kLm | \$EE |
| | | |
| <kbd>n</kbd> | kLSmalln | \$EF |
| <kbd>o</kbd> | kLo | \$F0 |
| <kbd>p</kbd> | kLp | \$F1 |
| <kbd>q</kbd> | kLq | \$F2 |
| <kbd>r</kbd> | kLSmallr | \$F3 |
| | | |
| <kbd>s</kbd> | kLs | \$F4 |
| <kbd>t</kbd> | kLt | \$F5 |
| <kbd>u</kbd> | kLu | \$F6 |
| <kbd>v</kbd> | kLv | \$F7 |
| <kbd>w</kbd> | kLw | \$F8 |
| | | |
| <kbd>x</kbd> | kLx | \$F9 |
| <kbd>y</kbd> | kLy | \$FA |
| <kbd>z</kbd> | kLz | \$FB |
