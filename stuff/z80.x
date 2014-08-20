{
import Debug.Trace
import Text.Pandoc.Definition
import Text.Pandoc.JSON (toJSONFilter)
}

%wrapper "posn"

$labelStart = [a-zA-Z_]
$label = [a-zA-Z0-9_]
$hex = [a-fA-F0-9]


tokens :-
    \n                          { \p s -> BOL s }
    "a"|"f"|"b"|"c"|"d"|"e"|"h"|"l"|"ixh"|"ixl"|"iyh"|"iyl"|"r"|"i" -- not even a little bit elegant, but easier than concocting and testing regexes
    | "A"|"F"|"B"|"C"|"D"|"E"|"H"|"L"|"IXH"|"IXL"|"IYH"|"IYL"|"R"|"I"   { \p s -> EightBit s}
    
    "af'"|"af"|"bc"|"de"|"hl"|"sp"|"pc"
    | "AF'"|"AF"|"BC"|"DE"|"HL"|"SP"|"PC"   {\p s -> SixteenBit s}
    
    "nz"|"z"|"nc"|"c"|"po"|"pe"|"p"|"m"|
    "NZ"|"Z"|"NC"|"C"|"PO"|"PE"|"P"|"M"     {\p s -> FlagBit s}
    
    "EX"|"EXX"|"LD"|"LDD"|"LDDR"|"LDI"|"LDIR"|"POP"|"PUSH"|
    "ADC"|"ADD"|"CP"|"CPD"|"CPDR"|"CPI"|"CPIR"|"CPL"|"DAA"|"DEC"|"INC"|"NEG"|"SBC"|"SUB"|
    "AND"|"BIT"|"CCF"|"OR"|"RES"|"SCF"|"SET"|"XOR"|
    "RL"|"RLA"|"RLC"|"RLCA"|"RLD"|"RR"|"RRA"|"RRC"|"RRCA"|"RRD"|"SLA"|"SRA"|"SRL"|
    "CALL"|"DJNZ"|"JP"|"JR"|"NOP"|"RET"|"RETI"|"RETN"|"RST"|
    "DI"|"EI"|"HALT"|"IM"|"IN"|"IND"|"INDR"|"INI"|"INIR"|"OTDR"|"OTIR"|"OUT"|"OUTD"|"OUTI"|
    "SLL"|
    "ex"|"exx"|"ld"|"ldd"|"lddr"|"ldi"|"ldir"|"pop"|"push"|
    "adc"|"add"|"cp"|"cpd"|"cpdr"|"cpi"|"cpir"|"cpl"|"daa"|"dec"|"inc"|"neg"|"sbc"|"sub"|
    "and"|"bit"|"ccf"|"or"|"res"|"scf"|"set"|"xor"|
    "rl"|"rla"|"rlc"|"rlca"|"rld"|"rr"|"rra"|"rrc"|"rrca"|"rrd"|"sla"|"sra"|"srl"|
    "call"|"djnz"|"jp"|"jr"|"nop"|"ret"|"reti"|"retn"|"rst"|
    "di"|"ei"|"halt"|"im"|"in"|"ind"|"indr"|"ini"|"inir"|"otdr"|"otir"|"out"|"outd"|"outi"|
    "sll"                       { \p s -> Keyword s}
    
    $labelStart $label* /\(     { \p s -> Macro s }
    
    \$
    | $labelStart $label* :?    { \p s -> Label s }

    [0-9]+
    | "$" $hex+
    | [0-9] $hex* h
    | \% [01]+
    | [01]+ b                   { \p s -> NumericLiteral s }
    
    \' . \'
    | \" [^ \" ]+ \"            { \p s -> StringLiteral s }

    "."[a-zA-Z]+
    | [\+\-\*\/=\\\|]
    | \<\< | \>\>
    | "#"[a-zA-z]+              { \p s -> Operator s }

    ($white # [\n])+
    | [\(\)\,\.]                { \p s -> Text s }

    ";".*                       { \p s -> Comment s }


{
data Token = Macro String
           | Label String
           | NumericLiteral String
           | StringLiteral String
           | Comment String
           | Operator String
           | Text String
           | Keyword String
           | SixteenBit String
           | EightBit String
           | FlagBit String
           | BOL String
           deriving (Eq, Show)

formatHTML :: [Token] -> String
formatHTML tokens = "<pre class='z80'>\n<span class='BOL'></span>" ++ (concatMap formatHTML' tokens) ++ "</pre>"

formatHTML' :: Token -> String
formatHTML' (Macro s) = hs "macro" s
formatHTML' (Label s) = hs "label" s
formatHTML' (NumericLiteral s) = hs "numeric literal" s
formatHTML' (StringLiteral s) = hs "string literal" s
formatHTML' (Comment s) = hs "comment" s
formatHTML' (Operator s) = hs "operator" s
formatHTML' (EightBit s) = hs "eightbit register" s
formatHTML' (SixteenBit s) = hs "sixteenbit register" s
formatHTML' (FlagBit s) = hs "flagbit register" s
formatHTML' (Text s) = s
formatHTML' (Keyword s) = hs "keyword" s
formatHTML' (BOL s) = hs "BOL" s

--- Generate an HTML span with CSS class and content.
hs :: String -> String -> String
hs cls content = "<span class='" ++ cls ++ "'>" ++ content ++ "</span>"

--- Top level pandoc filter
syntaxHighlight :: Maybe Format -> Block -> Block

-- If you need to debug, it's helpful to prepend the RawBlock
-- with "trace code" to print each block before lexing it.
syntaxHighlight (Just (Format "html5")) (CodeBlock (ident, "z80":classes, kvp) code) =
        RawBlock (Format "html") (formatHTML tokens)
    where tokens = alexScanTokens code

syntaxHighlight _ block = block

main = toJSONFilter syntaxHighlight
}
