import json
import sys

from PrototypeClass import PrototypeSearch


prototype_path = './public/prototypes/'
if __name__ == '__main__':

    instance = PrototypeSearch(prototype_path = prototype_path)

    for line in sys.stdin:
        print(json.dumps({
            'msgType': 'prototypeStatus',
            'message': 'got request ' + line
        }) + "\n")
        sys.stdout.flush()
        request = json.loads(line)

        if request.get('task') == 'prototype':
            #the format of request.get('disease') is like '10000'
            out_prototypes = instance.run(request.get('disease'))
        # out_prototypes = ['190329.png','120422.png','132445.png'] 

        print(json.dumps({
            'msgType': 'prototypeResponse',
            'inputDisease': request.get('disease'),
            'prototype': out_prototypes,
            'boundingBox': { #origin in upper left corner, Y increases down, X increases right,
                'left': 0.25,#fraction of width
                'right': 0.75, #fraction of width
                'top': 0.1, #fraction of height 
                'bottom': 0.8 #fraction of height
            }
        }) + "\n")

        
        sys.stdout.flush()

    