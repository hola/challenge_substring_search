exports.substring_search = function(substrings, text){
    const SUB_LEN = substrings.length;
    var res = {};

    if(SUB_LEN<15 || (text.length < 5000 && SUB_LEN<50)){
      var cleaned = new Array(SUB_LEN);
      for(s=0; s<SUB_LEN; s++){
          cleaned[s] = substrings[s].replace(/[[\]{}()*+?.\\^$|#\s]/g, '\\$&');
          //console.log(substrings[s]);
          var matches  = text.match(new RegExp(cleaned[s],'g'));
          
          res[substrings[s]] = (matches?matches.length:0);
      }
    }else{

    
      var lens = new Uint8Array(SUB_LEN); 
      var numFounds = new Uint32Array(SUB_LEN); 
      
      const LET = 0, SCORE=1, SUB_S = 2, SUB_L=2, SUB_I = 0, SUB_CHAR_I = 1;
      const FREQ = /[eotha ]/;
      const RARE = /[kvjqxz]/;
      const UPPERC_REGEX = /[A-Z]/;
          
      
      var code = '\
      var textChar = "";\n\
      var textLen = text.length;\n\
      for(var i=0;i!=textLen;i++){\n\
            textChar = text[i];\n\
              switch(textChar){\n';
      var allLetters = [];
      var ali = 0;
      var i =0;
      for(var s=0; s<SUB_LEN; s++){
          lens[s] = substrings[s].length - 1;
          
          for(var c=0; c<=lens[s]; c++){
            var letter = substrings[s][c];
            var letCc = letter.charCodeAt(0);
            var hasLetter = false;
            for(ali=0; !hasLetter && ali!=allLetters.length; ali++){
              if(allLetters[ali][LET]==letCc)hasLetter=true;
            }
            if(!hasLetter){
              //var score = (UPPERC_REGEX.test(letter)?30:(FREQ.test(letter)?0:(RARE.test(letter)?20:10)));
              var score = (UPPERC_REGEX.test(letter)?20:(FREQ.test(letter)?0:10));
              
              allLetters.push([letCc,score,s,c]);
              
            }else{
              var isSubin = false;
              var allSubs = allLetters[ali-1];
              for(var is=SUB_S; is<allSubs.length && !isSubin; is+=SUB_L){
                isSubin = (allSubs[is+SUB_I] == s);
              }
              allSubs[SCORE]+=15;
              if(!isSubin){
                allSubs.push(s,c);
              }
              
            }
            
          }
      }

      
      allLetters.sort((a,b) => { 
        if(a[SCORE] == b[SCORE])return 0;
        return (a[SCORE] > b[SCORE]?-1:1);
      });

     
      
      var cases = '';
      for(var i=0,subKey = [];i!=allLetters.length && subKey.length!=SUB_LEN; i++){
        var allSubs = allLetters[i];
        var isLetUsed = false;
        var l = String.fromCharCode(allSubs[LET]);
        
        
        for(var c=SUB_S; c!= allSubs.length && subKey.length!=SUB_LEN;c+=SUB_L){
          var s = allSubs[c+SUB_I];
          
          if(subKey.indexOf(s) == -1){
            if(!isLetUsed){
              cases += (subKey.length==0?'':'break;\n')+'case "'+l+'":';
              isLetUsed = true;            
            }

            subKey.push(s);
            if(lens[s] == 0){
              cases += 'numFounds['+s+']++;\n';  
            }else{
              var charPos = allSubs[c+SUB_CHAR_I];
              var ch = substrings[s][0];
              cases += ' if(';  
              
              var isFirst = true;
              for(var cp=0; cp<=lens[s]; cp++){
                ch = substrings[s][cp];
                if(charPos != cp){
                  if(!isFirst){
                    cases += ' && ';
                  }
                  isFirst = false;
                  cases += ' text[i'+(charPos-cp>0?'-':'+')+Math.abs(charPos-cp)+'] == "'+(ch=='"'||ch=='\\'?'\\'+ch:ch)+'"';
                }

              }

              cases += '){ numFounds['+s+']++; }\n';
              
            }

            
          
          }  
        }
      
      }
      
        
      code += cases+'}}';
      

      //console.log('code:'+code);
      (new Function('text','numFounds',code))(text, numFounds);
           
      
      for(s=0; s!=SUB_LEN; s++){
          res[substrings[s]] = numFounds[s];
      }
    }
    
    return res;


    //Tried this but was too slow
    function substring_search(substrings, text){
          const SUB_LEN = substrings.length;
          const NODE_C = 0, NODE_DEPTH = 1, NODE_ROOTED = 2, NODE_MERGED=3, NODE_LNKS = 4, NODE_FND=5, NODE_PAR_FND=6,  NODE_SI = 7;
          var rootNode = ['',0,0,0,[],new Uint8Array(SUB_LEN),new Uint8Array(SUB_LEN), new Uint8Array(SUB_LEN)];
          //var allNodes = [rootNode];

          var m1lens = new Uint8Array(SUB_LEN), numFnds = new Uint32Array(SUB_LEN);
          var firstChars = new Array(SUB_LEN);
          

          for(var s=0; s<SUB_LEN; ++s){
              m1lens[s] = substrings[s].length-1;
              firstChars[s] = substrings[s][0];
              addNode(s,0,rootNode[NODE_LNKS]);
          }

          // var rootChars = '', caseRootChars='';
          // for(var r=0, lnks = rootNode[NODE_LNKS], rl=lnks.length; r<rl; ++r){
          //     rootChars += lnks[r][NODE_C];
          //     caseRootChars += 'case "'+lnks[r][NODE_C]+'": break root;\n';
          // }
          //console.log('CHECK3 allNodes[9][NODE_DEPTH]==1:'+(allNodes[9][NODE_DEPTH]==1));
          
          for(var n=0, lnks=rootNode[NODE_LNKS], nl=lnks.length; n<nl; ++n){
              //console.log('\nin check loop n:'+n);
              checkParMatch(lnks[n][NODE_LNKS], rootNode, false, false, 1);
          }
              
          //     var nodes = allNodes[a][NODE_LNKS];
          //     console.log()
              
          // }

          //console.log('CHECK rootNode[NODE_LNKS][1][NODE_C]'+rootNode[NODE_LNKS][1][NODE_C]+' '+rootNode[NODE_LNKS][1][NODE_LNKS][4][NODE_C]+' '+rootNode[NODE_LNKS][1][NODE_LNKS][4][NODE_DEPTH]);
          // var cn = rootNode[NODE_LNKS][2][NODE_LNKS][1];
          // console.log('CHECK 2 rootNode[NODE_LNKS][2][NODE_LNKS][1][NODE_C]'+cn[NODE_C]+' cn=allNodes[14]'+(cn==allNodes[14]));

          var code = 'var inSubs = new Uint8Array('+SUB_LEN+'), lastMatch;\n\
      for(var i=0, textLen = text.length; i<textLen;){\n\
          root:{\n';
           code = genNodeCode(code,rootNode[NODE_LNKS],1);
           code += '}}\n';

           //console.log('code:'+code);
          (new Function('text','numFnds',code))(text, numFnds);
          
          var res = {};
          for(s=0; s<SUB_LEN; ++s){
               res[substrings[s]] = numFnds[s];
          }

          // var iter = 10;
          // res['Fort'] = 5*iter;
          // res['Yellowstone'] = 9*iter;
          // res['of'] = 22*iter;
          // res['buildings'] = 2 * iter;
          return res;

          function findNodeForChar(nchar, nodes){
              for(var n=0, nl=nodes.length; n<nl; ++n ){
                  if(nodes[n][NODE_C] == nchar){
                      return nodes[n];
                  }
              }
              return null;
          }
         
          
          function addNode(si,ci,nodes){
              var curChar = substrings[si][ci];
              var curNode = findNodeForChar(curChar, nodes);
              //console.log('in addNodes si:'+si+' ci:'+ci+' curChar:'+curChar+' nodes.length:'+nodes.length);
              if(curNode == null){
                  curNode = [curChar,ci+1,0,0,[],new Uint8Array(SUB_LEN),new Uint8Array(SUB_LEN),new Uint8Array(SUB_LEN)];
                  curNode[NODE_SI][si] = ci+1;
                  nodes.push(curNode);
                  //allNodes.push(curNode);
                  //console.log('create new node si:'+si+' node index:'+(nodes.length-1)+' allNodes index:'+(allNodes.length-1));
              }else{
                  //console.log('marking curNode[NODE_C]'+curNode[NODE_C]+' si:'+si);
                  curNode[NODE_SI][si] = ci+1;
              }    
              
              if(ci == m1lens[si]){
                  curNode[NODE_FND][si] = 1;
                  //console.log('adding node found curNode[NODE_C]'+curNode[NODE_C]+' si:'+si);
              }else{
                  //console.log('recursing');
                  addNode(si,++ci,curNode[NODE_LNKS]);
              }
          }

          function checkParMatch(nodes, parent, isMerge, isAppend, baseDepth){
              var baseNodes = parent[NODE_LNKS];
              //console.log('in checkParMatch nodes.length:'+nodes.length+' baseNodes:'+baseNodes.length+' isMerge:'+isMerge+' depth:'+baseDepth +' isAppend:'+isAppend );
              var savedNode, isNodeFnd, curNode;

              for(var n=0, nl=nodes.length;n<nl;++n){
                  savedNode = nodes[n].slice();   
                  isNodeFnd = false;
                  curNode = nodes[n];
                  //console.log('in node loop n:'+n+' curNode[NODE_C]:'+curNode[NODE_C]+' curNode[NODE_DEPTH]'+curNode[NODE_DEPTH]+' curNode[NODE_ROOTED]'+curNode[NODE_ROOTED]+' baseDepth:'+baseDepth+' isMerge:'+isMerge+' isAppend:'+isAppend);
                  if(!curNode[NODE_ROOTED] || isMerge){
                      curNode[NODE_ROOTED] = 1;
                      for(var b=0, curBaseNode, bl=baseNodes.length; b<bl; ++b){
                          curBaseNode = baseNodes[b];
                          //console.log('in base node loop b:'+b+'baseNodes[b][NODE_C]:'+baseNodes[b][NODE_C]+' curNode[NODE_DEPTH]'+curNode[NODE_DEPTH]+' curBaseNode[NODE_DEPTH]'+curBaseNode[NODE_DEPTH]);
                          if(curNode[NODE_C] == curBaseNode[NODE_C] && curNode[NODE_DEPTH] > curBaseNode[NODE_DEPTH]){
                              isNodeFnd = true;
                              //console.log('meging base node par fnd and curNode with curNode fnd ');
                              for(var s=0, bnf = curBaseNode[NODE_PAR_FND], cnf = curNode[NODE_FND], cnpf = curNode[NODE_PAR_FND]; s<SUB_LEN; ++s){
                                  if(bnf[s] || cnf[s] || cnpf[s])bnf[s] = 1;
                              }

                              nodes[n] = baseNodes[b];
                              //baseDepth = curBaseNode[NODE_DEPTH];
                              //console.log('node changed to base nodes[n][NODE_DEPTH]'+nodes[n][NODE_DEPTH]);
                              if(savedNode[NODE_LNKS].length){
                                  for(var s=0, bsi = curBaseNode[NODE_SI], csi = curNode[NODE_SI]; s<SUB_LEN; ++s){
                                      if(csi[s])bsi[s] = csi[s];
                                  }    
                                  //console.log('merging savedNode[NODE_LNKS].length:'+savedNode[NODE_LNKS].length+' baseNodes[b][NODE_LNKS]'+baseNodes[b][NODE_LNKS].length);
                                  //checkParMatch(savedNode[NODE_LNKS],curBaseNode, true, false, baseDepth+1); 
                                  checkParMatch(savedNode[NODE_LNKS],curBaseNode, true, false, curBaseNode[NODE_DEPTH]+1);   
                              }
                              break;
                          }
                      }
                      if((isMerge || isAppend) && !isNodeFnd){
                          if(isMerge && isAppend)return false;
                          //Array.prototype.push.apply(baseNodes, curNode);
                          for(var s=0, pf = curNode[NODE_PAR_FND], nf = curNode[NODE_FND]; s<SUB_LEN; ++s){
                              if(pf[s]|nf[s])pf[s]=1;
                              nf[s] = 0;    
                          }
                          if(curNode[NODE_DEPTH] < baseDepth)return false;
                          curNode[NODE_DEPTH] = baseDepth;
                          //console.log('CHECK2 allNodes[32][NODE_C]'+allNodes[32][NODE_C]+' '+allNodes[32][NODE_DEPTH]);
                          if(isMerge){
                              if(!checkParMatch([curNode], rootNode,true, true, 1)){
                                  baseNodes.push(curNode);
                                  //mergeSubsAffected(parent,curNode);
                                  //curNode[NODE_MERGED] = 1;
                                  //console.log('appending nodes curNode[NODE_C]'+curNode[NODE_C]+' isMerge:'+isMerge+' isAppend:'+isAppend+' parent[NODE_C]'+parent[NODE_C]);
                                  checkParMatch(curNode[NODE_LNKS], rootNode,false, true, baseDepth+1);
                              }
                          }else if(isAppend){
                              //console.log('appending nodes curNode[NODE_C]'+curNode[NODE_C]+' isMerge:'+isMerge+' isAppend:'+isAppend+' isNodeFnd:'+isNodeFnd);
                              //curNode[NODE_MERGED] = 1;
                              checkParMatch(curNode[NODE_LNKS], rootNode,false, true, baseDepth+1);
                          }
                          

                          // if(isMerge){
                          //     var isPosBasNode = false;
                          //     for(var b=0, rc, bl=rootNode[NODE_LNKS].length; b<bl; ++b){
                          //         if(rootNode[NODE_LNKS][b][NODE_C] == curNode[NODE_C]){
                          //             isPosBasNode = true; break;
                          //         }
                          //     }
                          //     if(isPosBasNode){
                          //         checkParMatch(curNode[NODE_LNKS], rootNode[NODE_LNKS],true, false, 1);            
                          //     }else{
                          //         baseNodes.push(curNode);
                          //         checkParMatch(curNode[NODE_LNKS], rootNode[NODE_LNKS],false, true, baseDepth+1);
                          //     }
                              
                          // }else{
                          //     if(!isAppend){
                          //         baseNodes.push(curNode);
                          //     }
                          //     checkParMatch(curNode[NODE_LNKS], rootNode[NODE_LNKS],false, true, baseDepth+1);        
                          // }
                          
                          
                          
                          //setParFnd(curNode[NODE_LNKS], baseDepth+1);
                      }else if(!isNodeFnd){
                          //console.log('recursing curNode[NODE_C]'+curNode[NODE_C]+' curNode[NODE_DEPTH]'+curNode[NODE_DEPTH]);
                          checkParMatch(curNode[NODE_LNKS], rootNode,false, false, 1);
                      }     
                  }
                  
              }
              //console.log('out checkParMatch');
              return isNodeFnd;
              
          }

          
          
          var lastMatch = new Array(SUB_LEN);
          function genNodeCode(code, nodes, depth){
              //console.log('in genNodeCode depth:'+depth+' nodes.length:'+nodes.length);
              var tabs = '';
              var resetSubs = new Uint8Array(SUB_LEN);

              // for(var t=0;t<depth;++t){
              //     tabs+= '  ';
              // }
              var nodeLen = nodes.length;

              var maxNodeDepth = 0;
              for(var n=0; n<nodeLen; ++n){
                  maxNodeDepth = Math.max(maxNodeDepth, nodes[n][NODE_DEPTH]);
              }
              
              //console.log('maxNodeDepth:'+maxNodeDepth+' depth:'+depth);
              if(maxNodeDepth<depth){
                  //console.log('returning  depth'+depth +' nodeLen:'+nodeLen );
                  return code;
              }
              
              if(nodeLen){
                  code +=  tabs+'switch(text[i]){\n';    
              }
              
              for(var n=0, curNode; n<nodeLen; ++n ){
                  curNode = nodes[n];
                  //console.log('in loop n:'+n+' curNode[NODE_C]'+curNode[NODE_C]+' curNode[NODE_DEPTH]'+curNode[NODE_DEPTH]+' depth:'+depth );
                  if(curNode[NODE_DEPTH]>=depth){
                      code += tabs+'case "'+curNode[NODE_C] +'": i++;\n';    
                      
                      for(var f=0, pf=curNode[NODE_PAR_FND];f<SUB_LEN; ++f){
                          if(pf[f]){
                              code += tabs+'if(inSubs['+f+']=='+m1lens[f]+' && lastMatch=="'+substrings[f][m1lens[f]-1]+'"){ numFnds['+f+']++; inSubs['+f+'] = 0;}\n'; //console.log("s:'+f+' found i:"+i)}\n';
                          }
                      }

                      
                      //code += tabs+'inSubs = new Uint8Array(['+curNode[NODE_SI]+']);\n';

                      //if(curNode[NODE_DEPTH] == 1 /*&& depth > 1*/){
                          var prevChar, resetSubCode='';
                          for(var s=0, sb, cnSubCi; s<SUB_LEN; ++s){
                              cnSubCi = curNode[NODE_SI][s];
                              if(cnSubCi && m1lens[s]){
                                  sb = substrings[s];
                                  //console.log('inSub s:'+s+' curNode[NODE_C]'+curNode[NODE_C]+' cnSubCi:'+cnSubCi+' curNode[NODE_DEPTH]'+curNode[NODE_DEPTH]+' firstChars[s]'+firstChars[s]);
                                  // if(curNode[NODE_DEPTH]!=1 && depth != 1){
                                  //     for(var pc=0; ;++pc){
                                  //         pc = sb.indexOf(curNode[NODE_C],pc);
                                  //         if(pc==-1)break;
                                  //         prevChar =sb[pc-1];
                                  //         for(var p=0;;++p){
                                  //             p = sb.indexOf(prevChar,p);
                                  //             if(p==-1)break;
                                  //             if(sb[p+1] != curNode[NODE_C] && p+1 <= m1lens[s] && rootChars.indexOf(sb[p+1]) != -1){
                                  //                 console.log('checking nonblocking:'+sb[p+1]+' prevChar:'+prevChar+' p:'+p+' rootChars:'+rootChars);
                                  //                 nonBlockCaseChars.push(sb[p+1]);
                                  //             }
                                  //         }
                                  //     }    
                                  // }
                                  
                                  
                                  //resetSubs[s] = 1;
                                  
                                  
                                  
                                  if(curNode[NODE_DEPTH] == 1 ){    
                                      if(cnSubCi!=1){
                                          code += tabs+'if(';
                                          for(var c=0, lastChar='', isCj=false, cs = substrings[s], cc = curNode[NODE_C]; c<=m1lens[s]; ++c){
                                              if(c!=0 && cs[c] == cc){
                                                  code += (isCj?' || ':'')+'(lastMatch == "'+lastChar+'" && inSubs['+s+']=='+c+')';
                                                  isCj=true;
                                              }
                                              lastChar = cs[c];
                                          }
                                          code+= '){inSubs['+s+']++; }else{ inSubs['+s+']='+(curNode[NODE_C][0]==firstChars[s]?'1':'0')+'; }\n';
                                      }else{
                                          code += tabs+'inSubs['+s+']=1; \n';    
                                      }
                                  }else{
                                      code += tabs+'inSubs['+s+']++; \n';
                                  }
                              }else{
                                  resetSubCode += 'inSubs['+s+']=0; ';
                              }    
                              
                              
                          }
                      code += tabs + resetSubCode;
                      //}
                      
                      for(var f=0, nf=curNode[NODE_FND];f<SUB_LEN; ++f){
                          if(nf[f])code += tabs+'numFnds['+f+']++;\n';
                      }
                      
                      code += tabs+ 'lastMatch="'+curNode[NODE_C]+'";\n'; 
                      code = genNodeCode(code, curNode[NODE_LNKS], depth+1);
                      code += tabs+'break root;\n';

                      //if sub has more than one char after previous char but doesn't not have a node then a non blocking case must be added
                      // for(var b=0, bl=nonBlockCaseChars.length; b<bl; ++b){
                      //     code += tabs+'case "'+nonBlockCaseChars[b]+'":break root;\n'
                      // }
                      // if(depth != 1){
                      //     code += caseRootChars;
                      // }
                  }
              }
              if(nodeLen){
                  //console.log('at default defCode:'+defCode+' depth:'+depth );
                  // var defCode = '';
                  // for(var s=0;s<SUB_LEN;++s){
                  //     if(resetSubs[s]){
                  //         defCode+= 'inSubs['+s+']=0; '; //console.log("inSubs '+s+' = 0 case '+curNode[NODE_C]+' i:"+i);';        
                  //     }
                  // }
                  //code += tabs+'default: '+(depth==1?'i++; inSubs = new Uint8Array('+SUB_LEN+');':defCode)+' }\n';
                  //code += tabs+'default: '+(depth==1?'i++; inSubs = new Uint8Array('+SUB_LEN+');':'inSubs = new Uint8Array('+SUB_LEN+');')+' }\n';
                  code += tabs+'default: '+(depth==1?'i++; inSubs = new Uint8Array('+SUB_LEN+');':'')+' }\n';
              }
              
              return code;

              //console.log('out genNodeCode');
          }   
    }
};