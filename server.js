const express=require('express');
const fs=require('fs');
const path=require('path');
const marked=require('marked');
const app=express();
const PORT=3000;
const markdownDir=path.join(__dirname,'markdown');

// Servir el único index.html
app.use(express.static('public'));
app.use(express.json());

// Listar archivos Markdown
app.get('/files',(req,res)=>{
    fs.readdir(markdownDir,(err,files)=>{
        if(err)return res.status(500).json({error:'Error al leer archivos'});
        const mdFiles=files.filter(f=>f.endsWith('.md'));
        res.json(mdFiles);
    });
});

// Ver archivo Markdown convertido a HTML
app.get('/file',(req,res)=>{
    const name=req.query.name;
    if(!name)return res.status(400).json({error:'Nombre no proporcionado'});
    const filePath=path.join(markdownDir,name);
    fs.readFile(filePath,'utf8',(err,data)=>{
        if(err)return res.status(404).json({error:'Archivo no encontrado'});
        const html=marked.parse(data);
        res.json({html});
    });
});

// Crear nuevo archivo Markdown
app.post('/file',(req,res)=>{
    const{name,content}=req.body;
    if(!name||!content)return res.status(400).json({error:'Datos incompletos'});
    const filePath=path.join(markdownDir,name);
    fs.writeFile(filePath,content,'utf8',err=>{
        if(err)return res.status(500).json({error:'Error al guardar archivo'});
        res.json({success:true});
    });
});

app.listen(PORT,()=>console.log(`Servidor corriendo en http://localhost:${PORT}`));
