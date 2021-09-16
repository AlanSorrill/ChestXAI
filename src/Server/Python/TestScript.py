import sys
inputData = sys.argv[1]
testOut = inputData.lower() + "_" + inputData.upper()
print(testOut)
sys.stdout.flush()