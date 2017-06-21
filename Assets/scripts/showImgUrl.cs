using System;
using System.IO;
using System.Text;
using System.Security.Permissions;
using System.Collections;
using System.Collections.Generic;

using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Windows;

public class showImgUrl : MonoBehaviour {
	public RawImage show;
	public RectTransform rt;
	private Rect rect; 
	public string name;
	private float w = 200;
	private float h = 100;

	private string ibm = "http://diylogodesigns.com/blog/wp-content/uploads/2016/04/ibm-logo-png-transparent-background.png";
	private string url = "http://diylogodesigns.com/blog/wp-content/uploads/2016/04/ibm-logo-png-transparent-background.png";
	private string txtDir;
	private Text cc;
	private WWW img;
	private WWW txtFile;
	private DateTime oldTime;

	IEnumerator Show () {
		
		Debug.Log ("displaying img");
		if (url == "null" || url == "undefined" || url == null)
			url = ibm;
		img = new WWW(url);
		yield return img;
		int iw = img.texture.width;
		int ih = img.texture.height;
		if (ih > 200) {
			ih = 200;
			iw = (int) (200f*(iw/ih));
			Debug.Log (iw);
		}
		rt.sizeDelta = new Vector2(iw, ih);
		Texture2D tex = new Texture2D ((int)iw, (int)ih, TextureFormat.DXT1, false);
		img.LoadImageIntoTexture (tex);
		yield return tex;
		Debug.Log (img);
		//yield return img;
		show.texture = tex;
	}
	// Use this for initialization
	void Start () {
		rect = rt.rect;
		w = rect.width;
		h = rect.height;
		
		string path = Application.dataPath.Substring (0, Application.dataPath.LastIndexOf ("/")) + "/"; 
		txtDir = path + name + ".txt";
		ibm = "file://" + path + "ibm.png";
		url = ibm;
		oldTime = File.GetLastWriteTimeUtc (txtDir);
		StartCoroutine(Show ());
	}
	
	// Update is called once per frame
	void Update () {
		DateTime newTime = File.GetLastWriteTimeUtc(txtDir);
		if (oldTime != newTime)
		{
			Debug.Log("oldtime"+oldTime);
			oldTime = newTime;
			txtFile = new WWW("file://" + txtDir);
			while (!txtFile.isDone) { };
			url = Encoding.Unicode.GetString ( File.ReadAllBytes (txtDir));
			Debug.Log (url);
			Debug.Log("newtime"+oldTime);
			StartCoroutine(Show ());
		}
	}
}     