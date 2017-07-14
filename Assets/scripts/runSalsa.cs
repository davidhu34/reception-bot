using System;
using System.IO;
using System.Security.Permissions;
using System.Collections;
using System.Collections.Generic;

using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Windows;

using CrazyMinnow.SALSA; // Import SALSA from the CrazyMinnow namespace
using CrazyMinnow.SALSA.MCS;

public class runSalsa : MonoBehaviour {
	//public CM_MCSSync mcs;
	private string clipDir;
	private string txtDir;

	private DateTime oldTime;
	private AudioClip myAudioClip;
	private WWW www;
	private WWW txtfile;

	private bool playing = false;
	private bool making = false;
	private bool audioReady = false;

	private Salsa3D salsa3D;
	private Animator anim;
	private RandomEyes3D eyes;

	void configSalsa () {
		// Salsa3D
		//gameObject.AddComponent<Salsa3D>(); // Add a Salsa3D component
		salsa3D = GetComponent<Salsa3D>(); // Get reference to the Salsa3D component
		//mcs.salsa3D = salsa3D;

		salsa3D.saySmallIndex = 0; // Set saySmall BlendShape index
		salsa3D.sayMediumIndex = 1; // Set sayMedium BlendShape index
		salsa3D.sayLargeIndex = 2; // Set sayLarge BlendShape index
		salsa3D.saySmallTrigger = 0.0005f; // Set the saySmall amplitude trigger
		salsa3D.sayMediumTrigger = 0.0001f; // Set the sayMedium amplitude trigger
		salsa3D.sayLargeTrigger = 0.0012f; // Set the sayLarge amplitude trigger
		salsa3D.audioUpdateDelay = 0.05f; // Set the amplitutde sample update delay
		salsa3D.blendSpeed = 5f; // Set the blend speed
		salsa3D.rangeOfMotion = 100f; // Set the range of motion
		//salsa3D.SetAudioClip(myAudioClip); // Set AudioClip
	}

	IEnumerator nextAudio () {
		txtfile = new WWW("file://" + txtDir);
		yield return txtfile;

		www = new WWW("file://" + clipDir + txtfile.text);
		myAudioClip = www.GetAudioClip();
		yield return www;
		while(!myAudioClip.isReadyToPlay){}

		salsa3D.SetAudioClip(myAudioClip);
		audioReady = true;
		making = false;
	}

	[PermissionSet(SecurityAction.Demand, Name = "FullTrust")]
	void Start()
	{
		clipDir = Application.dataPath.Substring(0, Application.dataPath.LastIndexOf("/")) + "/wavs/";
		txtDir = Application.dataPath.Substring(0, Application.dataPath.LastIndexOf("/")) + "/wavs/playing.txt";
		oldTime = File.GetLastWriteTimeUtc(txtDir);
		anim = GetComponent<Animator>();

		configSalsa ();
		StartCoroutine( nextAudio() );
	}

	void Update()
	{
		if (!playing && audioReady)
		{
			//Debug.Log("Play");
			playing = true;
			anim.SetBool("talking", true);
			salsa3D.Play();
		}
		else if (playing && !salsa3D.isTalking)
		{
			playing = false;
			audioReady = false;
			//Debug.Log ("end");
			anim.SetBool("talking", false);
		}

		if (!audioReady && !making )
		{
			DateTime newTime = File.GetLastWriteTimeUtc(txtDir);
			if (oldTime != newTime)
			{
				oldTime = newTime;
				making = true;
				StartCoroutine( nextAudio() );
			}
		}

	}
}
