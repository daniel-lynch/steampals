function getFriendsGames() {
    let friends = [];
    let friendsNames = [];
    $('input:checkbox:checked').each(function () {
        friends.push($(this).attr("friend"))
    });
    $('input:checkbox:checked').each(function () {
        friendsNames.push($(this).attr("friendname"))
    });
    friendsNames = friendsNames.join(", ")
    console.log(friends);
    $.ajax({
        url: "/",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({ friends }),
        success: function (results) {
            $(".container").append(`<p>Comparing with ${friendsNames}</p>`)
            console.log(results);
            $("#compareRow").remove();
            results.map((game) => {
                $(".container").append(`${game}<br>`);
            })
        },
        error: function () {
            $(".container").append(`<p>Comparing with ${friendsNames}</p>`)
            $("#compareRow").remove();
            $(".container").append("No games found.")
        }
    })
}