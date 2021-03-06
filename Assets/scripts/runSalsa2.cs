﻿using System;
using System.IO;
using System.Security.Permissions;
using System.Collections;
using System.Collections.Generic;

using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Windows;

using CrazyMinnow.SALSA; // Import SALSA from the CrazyMinnow namespace

public class runSalsa2 : MonoBehaviour {

	private string clipName = "dialog.wav";
	private string clipDir;
	private string txtDir;
	public DateTime oldTime;
	public AudioClip myAudioClip;
	public AudioClip myAudioClip2;
	public WWW www;
	public WWW www2;
	public WWW txtfile;
	public bool playing = false;
	public bool started = false;
	public bool waiting = false;
	public bool destroyed = false;
	public bool making = false;
	private Salsa3D salsa3D;
	public Animator anim;
	public RandomEyes3D eyes;
	public GameObject cam;
	public Text answer;
	public GameObject debugAC;

	void makeSalsa( string name) {
		Debug.Log("make");
		www = new WWW("file://" + clipDir+name);
		myAudioClip = www.GetAudioClip();
		//Debug.Log(myAudioClip.isReadyToPlay);
		while (!www.isDone) ;
		debugAC.GetComponent<AudioSource>().clip = myAudioClip;
		Debug.Log(myAudioClip.isReadyToPlay);
		// Salsa3D
		gameObject.AddComponent<Salsa3D>(); // Add a Salsa3D component
		salsa3D = GetComponent<Salsa3D>(); // Get reference to the Salsa3D component
		salsa3D.skinnedMeshRenderer = GameObject.Find("Ethan/char_ethan_body").GetComponent<SkinnedMeshRenderer>(); // Link the SkinnedMeshRenderer
		salsa3D.saySmallIndex = 0; // Set saySmall BlendShape index
		salsa3D.sayMediumIndex = 1; // Set sayMedium BlendShape index
		salsa3D.sayLargeIndex = 2; // Set sayLarge BlendShape index
		salsa3D.SetAudioClip(myAudioClip); // Set AudioClip
		// Or set the AudioClip from a clip in any Resources folder
		//salsa3D.SetAudioClip((Resources.Load("EthanEcho0", typeof(AudioClip)) as AudioClip));
		salsa3D.saySmallTrigger = 0.001f; // Set the saySmall amplitude trigger
		salsa3D.sayMediumTrigger = 0.002f; // Set the sayMedium amplitude trigger
		salsa3D.sayLargeTrigger = 0.004f; // Set the sayLarge amplitude trigger
		salsa3D.audioUpdateDelay = 0.05f; // Set the amplitutde sample update delay
		salsa3D.blendSpeed = 10f; // Set the blend speed
		salsa3D.rangeOfMotion = 100f; // Set the range of motion
		making = false;
		destroyed = false;
		waiting = true;
	}
	// Use this for initialization
	[PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
	void Start () {
		clipDir = Application.dataPath.Substring(0, Application.dataPath.LastIndexOf("/")) + "/lib/wavs/";
		//clipDir = Application.dataPath.Substring(0, Application.dataPath.LastIndexOf("/")) + "/wavs/";
		txtDir = Application.dataPath.Substring(0, Application.dataPath.LastIndexOf("/")) + "/wavname.txt";
		oldTime = File.GetLastWriteTimeUtc(txtDir);
		txtfile = new WWW("file://" + txtDir);
		while (!txtfile.isDone) { };
		char ucode = '\u4e2d';

		anim = GetComponent<Animator>();
		eyes = GetComponent<RandomEyes3D>();
		eyes.SetLookTarget(cam);

		makeSalsa(txtfile.text);
	}
	// Update is called once per frame
	void Update()
	{
		if (!playing && waiting && !destroyed)
		{
			Debug.Log("Play");
			salsa3D.Play();
			anim.SetBool("talking", true);
			playing = true;

		}
		if (destroyed && !salsa3D && !making) 
		{
			//Debug.Log("waiting for new");
			DateTime newTime = File.GetLastWriteTimeUtc(txtDir);
			if (oldTime != newTime)
			{
				Debug.Log("oldyime"+oldTime);
				oldTime = newTime;
				Debug.Log("newtime"+oldTime);
				making = true;
				txtfile = new WWW("file://" + txtDir);
				while (!txtfile.isDone) { };
				makeSalsa(txtfile.text);
			}
		}
	}
	void LateUpdate()
	{
		if (playing && !salsa3D.isTalking)
		{
			playing = false;
			waiting = false;
			Destroy(salsa3D);
			destroyed = true;
			anim.SetBool("talking", false);
		}
	}
}