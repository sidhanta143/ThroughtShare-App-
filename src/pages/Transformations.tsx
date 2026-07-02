import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { 
  transformImage, transformDocument, mergeTextFiles, splitTextFile 
} from '../utils/transform';
import { 
  RefreshCw, Upload, Sparkles, CheckCircle, 
  Download, ArrowRight, Shield, Play, History, FileText, ImageIcon, Archive
} from 'lucide-react';
import { formatBytes } from '../utils/storage';

interface FileToProcess {
  file: File;
  content: string;
}

export const Transformations: React.FC = () => {
  const { 
    transformations, addTransformationHistory, 
    updateTransformationProgress, triggerNotification 
  } = useAppState();

  const [selectedType, setSelectedType] = useState<
    'pdf_to_word' | 'word_to_pdf' | 'image_compress' | 'image_convert' | 'zip_compress' | 'file_merge' | 'file_split'
  >('pdf_to_word');

  const [filesToProcess, setFilesToProcess] = useState<FileToProcess[]>([]);
  
  // Custom states depending on type
  const [compressQuality, setCompressQuality] = useState<number>(0.85);
  const [convertFormat, setConvertFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/jpeg');
  const [splitLinesNum, setSplitLinesNum] = useState<number>(30);

  // Active status
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [transformationProgress, setTransformationProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');

  // Result output
  const [generatedResults, setGeneratedResults] = useState<{ blob: Blob; name: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files) as File[];
      
      selected.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilesToProcess(prev => [
            ...prev, 
            { file, content: (event.target?.result as string) || '' }
          ]);
        };
        // read text/plain or simple representation, fallback to string
        reader.readAsText(file.slice(0, 10000));
      });
      triggerNotification(`Buffered ${selected.length} files successfully`, 'success');
    }
  };

  const executeTransformation = async () => {
    if (filesToProcess.length === 0) {
      triggerNotification('Please upload files before executing transformations!', 'error');
      return;
    }

    setIsProcessing(true);
    setTransformationProgress(10);
    setGeneratedResults([]);
    
    const primeFile = filesToProcess[0];
    const initialHistId = addTransformationHistory(
      primeFile.file.name, 
      selectedType, 
      primeFile.file.size
    );
    setActiveHistoryId(initialHistId);

    try {
      // Simulate pipeline steps
      setProcessingStatus('Analysing structure matrices...');
      await new Promise(r => setTimeout(r, 400));
      setTransformationProgress(30);

      setProcessingStatus('Executing buffer layouts...');
      await new Promise(r => setTimeout(r, 400));
      setTransformationProgress(60);

      let processedBytes = primeFile.file.size;
      const results: { blob: Blob; name: string }[] = [];

      // Execute dynamic transforming algorithms
      if (selectedType === 'image_compress') {
        const res = await transformImage(primeFile.file, {
          format: primeFile.file.type as any || 'image/jpeg',
          quality: compressQuality
        });
        results.push({ blob: res.blob, name: `Compressed_${primeFile.file.name}` });
        processedBytes = res.blob.size;
        
      } else if (selectedType === 'image_convert') {
        const targetExt = convertFormat.split('/')[1] || 'jpg';
        const rawName = primeFile.file.name.replace(/\.[^/.]+$/, "");
        
        const res = await transformImage(primeFile.file, {
          format: convertFormat,
          quality: 0.95
        });
        results.push({ blob: res.blob, name: `${rawName}.${targetExt}` });
        processedBytes = res.blob.size;

      } else if (selectedType === 'pdf_to_word' || selectedType === 'word_to_pdf') {
        const res = transformDocument(primeFile.file.name, primeFile.content, selectedType);
        results.push(res);
        processedBytes = res.blob.size;

      } else if (selectedType === 'file_split') {
        const list = splitTextFile(primeFile.file.name, primeFile.content, splitLinesNum);
        results.push(...list);
        processedBytes = list.reduce((acc, current) => acc + current.blob.size, 0);

      } else if (selectedType === 'file_merge') {
        const inputFiles = filesToProcess.map(x => ({ name: x.file.name, content: x.content }));
        const res = mergeTextFiles(inputFiles, 'Compiled_TransForma_Merge.txt');
        results.push(res);
        processedBytes = res.blob.size;

      } else if (selectedType === 'zip_compress') {
        // Zip packing simulation
        const contentSummary = filesToProcess.map(x => `Item: ${x.file.name} [Size: ${x.file.size} bytes]`).join('\n');
        const simulatedZipBlob = new Blob([contentSummary], { type: 'application/zip' });
        results.push({ blob: simulatedZipBlob, name: `TransForma_Package_${Date.now().toString().slice(-4)}.zip` });
        processedBytes = simulatedZipBlob.size;
      }

      setProcessingStatus('Recompiling binary streams...');
      await new Promise(r => setTimeout(r, 400));
      setTransformationProgress(90);

      setGeneratedResults(results);
      updateTransformationProgress(initialHistId, 100, 'completed', processedBytes);
      triggerNotification('Transformation compiled successfully!', 'success');

    } catch (err: any) {
      console.error(err);
      updateTransformationProgress(initialHistId, 0, 'failed');
      triggerNotification('Transformation matrix failed compiling.', 'error');
    } finally {
      setIsProcessing(false);
      setTransformationProgress(100);
      setProcessingStatus('');
    }
  };

  const handleResultsDownload = (res: { blob: Blob; name: string }) => {
    const url = URL.createObjectURL(res.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = res.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadHistoryFileSimulated = (item: typeof transformations[0]) => {
    // Generate simple blob corresponding to history
    const dummyBlob = new Blob([`TransForma file transform download payload: ${item.fileName}`], { type: 'text/plain' });
    const url = URL.createObjectURL(dummyBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archive_${item.fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerNotification('Historical downloaded element compiled.', 'success');
  };

  const clearBufferedFiles = () => {
    setFilesToProcess([]);
    setGeneratedResults([]);
    setTransformationProgress(0);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Prime Header Block */}
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Active Conversion workstation</h2>
          <p className="text-xs text-gray-400">Convert, Split, Merge, or Compress files client-side instantly.</p>
        </div>
        <button onClick={clearBufferedFiles} className="text-xs text-indigo-500 font-semibold hover:underline">Clear buffered files</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Workspace controls */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Configure transformation type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { id: 'pdf_to_word', name: 'PDF to Word', icon: FileText },
                { id: 'word_to_pdf', name: 'Word to PDF', icon: FileText },
                { id: 'image_compress', name: 'Image Compression', icon: Sparkles },
                { id: 'image_convert', name: 'Image Convert', icon: ImageIcon },
                { id: 'zip_compress', name: 'ZIP Compression', icon: Archive },
                { id: 'file_merge', name: 'Merge Documents', icon: RefreshCw },
                { id: 'file_split', name: 'Split documents', icon: RefreshCw },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setSelectedType(opt.id as any); setGeneratedResults([]); }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedType === opt.id 
                      ? 'border-indigo-500 bg-indigo-50/40 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 font-bold' 
                      : 'border-gray-100 text-gray-600 hover:bg-gray-50 dark:hover:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <opt.icon className="w-4 h-4 mb-2 text-indigo-505" />
                  <span className="text-xs block leading-tight">{opt.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload panel inside workstation */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Buffered source files ({filesToProcess.length})</label>
            <div className="border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-6 text-center bg-gray-50/50 dark:bg-zinc-950/20 hover:bg-gray-50 transition-colors relative">
              <input 
                type="file" 
                multiple={selectedType === 'file_merge' || selectedType === 'zip_compress'}
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="font-bold text-xs text-gray-800 dark:text-zinc-250">Click or Drag to process documents</p>
              <p className="text-[10px] text-gray-400 mt-1">Image JPG/PNG, plain text (.txt), docx support exists locally.</p>
            </div>

            {filesToProcess.length > 0 && (
              <div className="space-y-1.5 pt-2 max-h-36 overflow-y-auto">
                {filesToProcess.map((f, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-850 p-2 rounded-xl text-xs">
                    <span className="font-semibold text-gray-700 dark:text-zinc-300 truncate max-w-sm">{f.file.name}</span>
                    <span className="text-[10px] text-gray-400 shrink-0">{formatBytes(f.file.size)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings depending on active transformations */}
          {selectedType === 'image_compress' && (
            <div className="space-y-2 bg-indigo-50/20 dark:bg-zinc-955 p-4 rounded-2xl border border-indigo-150/30">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-600 dark:text-zinc-300">Set Target quality</span>
                <span className="text-indigo-600">{Math.round(compressQuality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={compressQuality}
                onChange={(e) => setCompressQuality(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 h-1 rounded bg-gray-200 dark:bg-zinc-850"
              />
              <p className="text-[10px] text-gray-400 leading-tight">Lowering ratios compresses graphics files pixel grid weights.</p>
            </div>
          )}

          {selectedType === 'image_convert' && (
            <div className="space-y-2 bg-indigo-50/20 dark:bg-zinc-955 p-4 rounded-2xl border border-indigo-150/30 text-xs">
              <label className="font-bold text-gray-600 dark:text-zinc-300">Select output image target format</label>
              <div className="flex gap-2 pt-1">
                {[
                  { id: 'image/jpeg', name: 'JPEG format' },
                  { id: 'image/png', name: 'PNG format' },
                  { id: 'image/webp', name: 'WebP format' },
                ].map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setConvertFormat(form.id as any)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                      convertFormat === form.id 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                        : 'bg-white hover:bg-gray-50 border-gray-150 text-gray-700'
                    }`}
                  >
                    {form.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedType === 'file_split' && (
            <div className="space-y-2 bg-indigo-50/20 dark:bg-zinc-955 p-4 rounded-2xl border border-indigo-150/30 text-xs text-left">
              <label className="font-bold text-gray-650 dark:text-zinc-300">Choose Split Lines chunking interval</label>
              <input
                type="number"
                value={splitLinesNum}
                onChange={(e) => setSplitLinesNum(Math.max(1, Number(e.target.value)))}
                className="w-full mt-1.5 px-4 py-2 border border-gray-100 bg-white dark:border-zinc-805 dark:bg-zinc-950 rounded-lg text-xs"
              />
            </div>
          )}

          <button
            onClick={executeTransformation}
            disabled={isProcessing || filesToProcess.length === 0}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Transforming pipeline matrices active...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Begin Transformation process</span>
              </>
            )}
          </button>
        </div>

        {/* Real-time Result Screen */}
        <div className="lg:col-span-5 bg-gradient-to-tr from-indigo-950 to-zinc-950 text-white p-6 rounded-3xl flex flex-col justify-between shadow-xl min-h-[460px]">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400" /> Output monitor
              </h4>
              <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded uppercase font-bold">Monitor live</span>
            </div>

            {isProcessing && (
              <div className="space-y-6 text-center py-12">
                <RefreshCw className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
                <div className="space-y-2">
                  <p className="font-bold text-xs">{processingStatus}</p>
                  <p className="text-[11px] text-zinc-400">{transformationProgress}% completed</p>
                </div>
                <div className="h-1.5 w-full bg-white/15 rounded-full overflow-hidden max-w-xs mx-auto">
                  <div className="h-full bg-indigo-400 transition-all duration-300" style={{ width: `${transformationProgress}%` }} />
                </div>
              </div>
            )}

            {!isProcessing && generatedResults.length === 0 && (
              <div className="py-20 text-center text-zinc-500 space-y-4">
                <Shield className="w-10 h-10 text-zinc-700 mx-auto" />
                <h5 className="font-bold text-xs text-zinc-400">Stream idle. Ready to process.</h5>
                <p className="text-[11px] text-zinc-650 max-w-xs mx-auto">Upload a document on the left and select transforms to populate payload streams here.</p>
              </div>
            )}

            {!isProcessing && generatedResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 border border-white/10 p-3 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-xs text-white">Pipeline operations completed</h5>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{generatedResults.length} output streams compiled.</p>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {generatedResults.map((res, index) => (
                    <div key={index} className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-xl gap-3 text-xs">
                      <div className="truncate flex-1">
                        <p className="font-bold text-zinc-200 truncate">{res.name}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Size: {formatBytes(res.blob.size)}</p>
                      </div>
                      
                      {/* Download option remains permanently visible */}
                      <button
                        onClick={() => handleResultsDownload(res)}
                        className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold p-2 rounded-lg shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Download transformed file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/5 pt-4 text-[10px] text-zinc-500 leading-tight">
            Transformed blocks compiled locally instantly.
          </div>
        </div>

      </div>

      {/* History log segment on transformations */}
      <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl space-y-4 text-left">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-zinc-850">
          <History className="w-4.5 h-4.5 text-indigo-500" />
          <h4 className="font-bold text-xs text-gray-900 dark:text-zinc-100">Transformation logs history ({transformations.length})</h4>
        </div>

        {transformations.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">No logs registered yet. Select workstation pipelines.</div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {transformations.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-gray-50 dark:border-zinc-850 rounded-xl hover:bg-gray-50/50 dark:hover:bg-zinc-950/20 text-xs">
                <div>
                  <p className="font-extrabold text-gray-700 dark:text-zinc-200">{item.fileName}</p>
                  <div className="flex gap-4 text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">
                    <span>Task: {item.type.replace('_', ' ')}</span>
                    <span className="text-indigo-500 font-bold">Compiled</span>
                    <span>Date: {new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Download parameters permanently visible */}
                <button 
                  onClick={() => downloadHistoryFileSimulated(item)}
                  className="p-2 border border-gray-150 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-gray-50 cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
