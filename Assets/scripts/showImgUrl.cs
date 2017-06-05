using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class showImgUrl : MonoBehaviour {
	public RawImage show;
	public string source;
	// Use this for initialization
	IEnumerator Start () {
		WWW img = new WWW("http://diylogodesigns.com/blog/wp-content/uploads/2016/04/ibm-logo-png-transparent-background.png");
		yield return img;

		show.texture = (Texture)img.texture;
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
