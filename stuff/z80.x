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
    $labelStart $label* :?      { \p s -> Label s }

    [0-9]+
    | \" [^ \" ]+ \"
    | "$" $hex+
    | [0-9] $hex* h
    | \% [01]+
    | [01]+ b                   { \p s -> Literal s }

    "."[a-zA-Z]+
    | [\+\-\*\/]
    | "#"[a-zA-z]+              { \p s -> Operator s }

    $white+
    | [\(\)\,]                  { \p s -> Text s }

    ";".*                       { \p s -> Comment s }


{
data Token = Label String
           | Literal String
           | Comment String
           | Operator String
           | Text String
           | Keyword String     -- Register
           deriving (Eq, Show)

formatHTML :: [Token] -> String
formatHTML tokens = "<pre class='z80'>" ++ (concatMap formatHTML' tokens) ++ "</pre>"

formatHTML' :: Token -> String
formatHTML' (Label s) = hs "label" s
formatHTML' (Literal s) = hs "literal" s
formatHTML' (Comment s) = hs "comment" s
formatHTML' (Operator s) = hs "operator" s
formatHTML' (Text s) = s
formatHTML' (Keyword s) = hs "keyword" s

--- Generate an HTML span with CSS class and content.
hs :: String -> String -> String
hs cls content = "<span class='" ++ cls ++ "'>" ++ content ++ "</span>"

--- Top level pandoc filter
syntaxHighlight :: Maybe Format -> Block -> Block

syntaxHighlight (Just (Format "html5")) (CodeBlock (ident, "z80":classes, kvp) code) =
        RawBlock (Format "html") (formatHTML tokens)
    where tokens = alexScanTokens code

syntaxHighlight _ block = block

main = toJSONFilter syntaxHighlight
}
