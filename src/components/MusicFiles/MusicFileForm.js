import React, {useState, useRef } from 'react'
import Card from '../UI/Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../services/firebase'
import './MusicFileForm.css'
import './MusicUpload'
import MusicUpload from './MusicUpload';
import MusicFileList from './MusicFileList'
import firebase from '../../services/firebase'
import { v4 } from 'uuid';
import { callbackify } from 'util';

function MusicFileForm () {

    //State varialbes
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userId, setUserId] = useState('')
    const [filename, setFilename] = useState('')
    const [note, setNote] = useState('')
    
    firebase.auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          setIsLoggedIn(true)
          setUserId(firebaseUser.uid)
          console.log("firebaseUSer", firebaseUser);
        } else {
          setUserId('')
        }
      });  


    const submitHandler = event => {
        event.preventDefault()
        console.log("submit handler fired")
    }
    
    const getFilename = (e) => {
        setFilename(filename)
    }

    const addFile = e => {
        console.log("addFile submited")
        e.preventDefault();
        db.collection("music").doc(userId).collection('musicId').doc().set({
            filename: filename,
            note: note   
        });
        console.log("addFile filename", filename)
    }

    const getNote = e => {
        setNote(e.target.options[e.target.selectedIndex].text)
    }   

    let uid = firebase.auth.currentUser.uid
    console.log("firebase auth id: ", uid)
  
    const [progress, setProgress] = useState(0)
    const [files, setFiles] = useState({})
    console.log("files ", typeof(files))
    const fileInput = useRef();
    var storageRef, file, rnd , fileref
     
    
    const handleChange = e => {
      e.preventDefault();
      
      const files = e.target.files
      let obj = { files: files, value : e.target.value }
      setFiles(obj);     
    
      Object.keys(obj.files).forEach(k => {
         file = obj.files[k]
        rnd = v4()
        console.log("rnd", rnd)
        storageRef = firebase.storage.ref(`football_pics/${uid}/${rnd}_${file.name}`);
        var task = storageRef.put(file);
  
        task.on('state_changed',
  
          function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred /
              snapshot.totalBytes) * 100;
            setProgress(percentage);
          },
  
          function error(err) {
            console.log("error uploading file", err);
          },
  
          function complete() {
            console.log("upload complete");
            setProgress(0)
            setFiles(obj)  
            console.log("obj", fileInput.current.value)   
            callbackSetFileName(fileInput.current.value)
            fileInput.current.value = null
          }        
        );        
      })    
    }

    const callbackSetFileName = (fileInput) => {
        setFilename(fileInput)
        console.log("filename ", filename)
    }


    return (
        <section> 
            <form className="form-inline justify-content-center" onSubmit={submitHandler}>                        
                <div className="App">
                    <progress value={progress} max="100" id="uploader">0%</progress>
                    <input ref={fileInput} type="file" onChange={handleChange} />
                    <span>Filename: {files[0] && files[0].name}</span>      
                </div>
                <div className="form-group mr-2">                        
                    <select className="form-control" onChange={getNote}>
                                 <option defaultValue="selected">Note associated with file:</option>
                                 <option value="Gb">G-Flat</option>
                                 <option value="G">G-Natural</option>
                                 <option value="G#">G-Sharp</option>
                    </select>
                </div>                       
                <div className="form-group mr-2">
                    <button className="btn btn-primary" type="submit" onClick={addFile}>Upload File</button>  
                </div>                       
            </form>
                <div>Filename: {filename} </div>
                 <div><MusicFileList userId={userId}/></div> 
             </section> 
    )
}

export default MusicFileForm