﻿using System;
using System.IO;
using System.Text;
using System.Security.Permissions;
using System.Collections;
using System.Collections.Generic;

using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Windows;


public class subtitile : MonoBehaviour {
	public string name;
	private string txtDir;
	private Text cc;
	private WWW txtFile;
	private DateTime oldTime;
	// Use this for initialization
	void Start () {
		txtDir = Application.dataPath.Substring(0, Application.dataPath.LastIndexOf("/")) + "/"+name+".txt";
		oldTime = File.GetLastWriteTimeUtc (txtDir);
		cc = gameObject.GetComponent<Text> ();
	}
	IEnumerator updateFile () {
		txtFile = new WWW("file://" + txtDir);
		yield return txtFile;
		cc.text = Encoding.Unicode.GetString ( File.ReadAllBytes (txtDir));
	}
	// Update is called once per frame
	void Update () {
		DateTime newTime = File.GetLastWriteTimeUtc(txtDir);
		if (oldTime != newTime)
		{
			//Debug.Log("oldyime"+oldTime);
			oldTime = newTime;
			StartCoroutine (updateFile ());
			//Debug.Log("newtime"+oldTime);
		}
	}
}
