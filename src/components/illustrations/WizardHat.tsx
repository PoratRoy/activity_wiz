/** The logo's wizard hat and its two gold sparks, without the green tile. Meant for a dark green ground. */
export function WizardHat({ width = 160 }: { width?: number }) {
  return (
    <svg width={width} height={Math.round((width * 690) / 780)} viewBox="140 140 780 690" role="img" aria-label="ActivityWiz">
      <path
        fill="#FFD43B"
        d="M361 169Q365 160 370 169C390 202 410 216 433 225Q440 228 433 233C406 253 389 276 380 299Q377 307 372 299C354 271 334 255 308 245Q300 242 307 237C333 219 351 193 361 169Z"
      />
      <path
        fill="#FFD43B"
        d="M810 320Q816 309 821 320C839 357 860 379 889 395Q897 400 888 404C851 416 827 439 807 478Q802 488 797 477C781 438 757 419 709 403Q700 400 710 395C755 376 788 352 810 320Z"
      />
      <path
        fill="#FFFBEF"
        d="M309 611C344 532 377 453 409 378C424 343 446 320 479 298L640 223C662 211 680 216 691 229C701 241 699 256 691 274L636 386C624 410 619 428 623 449L681 639C751 661 798 689 811 719C825 750 786 770 731 783C615 810 416 801 297 767C219 745 171 714 166 684C161 657 195 632 243 621C264 616 287 613 309 611Z"
      />
    </svg>
  );
}
